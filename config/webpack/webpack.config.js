import path from 'node:path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import pkg from '../../package.json' with { type: 'json' };

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUTPUT_FOLDER = path.resolve(ROOT, 'extension');

export default {
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
    path: OUTPUT_FOLDER,
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
            const manifest = JSON.parse(content.toString());
            manifest.version = pkg.version;
            return Buffer.from(JSON.stringify(manifest));
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
