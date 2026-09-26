import path from 'node:path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import pkg from '../../package.json' with { type: 'json' };

const ROOT = path.resolve(import.meta.dirname, '../..');

const FIREFOX_ADDON_ID = '{52665c48-f9ad-4fdc-8729-1f7e35244a25}';

function transformManifest(manifest, isFirefox) {
  // package.json is the only source of the version, semantic-release bumps it on release
  manifest.version = pkg.version;

  if (isFirefox) {
    // Firefox runs MV3 backgrounds as event pages, service workers are not supported
    manifest.background = { scripts: [manifest.background.service_worker] };
    manifest.browser_specific_settings = {
      gecko: {
        id: FIREFOX_ADDON_ID,
        // First version (desktop and Android) supporting data_collection_permissions
        strict_min_version: '142.0',
        data_collection_permissions: { required: ['none'] },
      },
    };
  }

  return manifest;
}

export default (env = {}) => {
  const isFirefox = env.target === 'firefox';

  return {
    entry: {
      background: path.resolve(ROOT, 'src/background.ts'),
      content: path.resolve(ROOT, 'src/content.ts'),
      popup: path.resolve(ROOT, 'src/popup.tsx'),
      // Functions
      bbcode: path.resolve(ROOT, 'src/features/comments-bbcode/inject/bbcode.ts'),
    },
    // Bundles are loaded locally by the browser, size hints do not apply
    performance: { hints: false },
    // Default `eval` source maps are not allowed by the extension CSP
    devtool: false,
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: '{{title}}', replace: pkg.name, flags: 'gi' },
              { search: '{{homepage}}', replace: pkg.homepage, flags: 'gi' },
              { search: '{{author}}', replace: pkg.author.name, flags: 'gi' },
              { search: '{{authorPage}}', replace: pkg.author.url, flags: 'gi' },
              { search: '{{version}}', replace: pkg.version, flags: 'gi' },
              { search: '{{bugs}}', replace: pkg.bugs.url, flags: 'gi' },
            ],
          },
        },
        {
          test: /\.tsx?$/,
          loader: 'esbuild-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.svg$/,
          type: 'asset/source',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(ROOT, isFirefox ? 'extension-firefox' : 'extension'),
      clean: true,
      // Extension scripts must not lazy-load chunks, content scripts would resolve them against the website
      asyncChunks: false,
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(ROOT, 'src/manifest.json'),
            transform(content) {
              return Buffer.from(JSON.stringify(transformManifest(JSON.parse(content.toString()), isFirefox)));
            },
          },
          {
            from: path.resolve(ROOT, 'src/popup.html'),
            transform(content) {
              return Buffer.from(
                content.toString()
                  .replace(/{{title}}/g, pkg.name)
                  .replace(/{{version}}/g, pkg.version)
              );
            },
          },
          { from: path.resolve(ROOT, 'src/assets') },
          // NPM dependencies
          { from: path.resolve(ROOT, 'node_modules/sceditor/minified/sceditor.min.js') },
          { from: path.resolve(ROOT, 'node_modules/sceditor/minified/formats/bbcode.js') },
        ],
      }),
    ],
  };
};
