const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const OUTPUT_FOLDER = path.resolve(__dirname, '../../extension');

module.exports = {
  entry: {
    background: path.resolve(__dirname, '../../src/background.ts'),
    content: path.resolve(__dirname, '../../src/content.ts'),
    popup: path.resolve(__dirname, '../../src/popup.tsx'),
    // Functions
    bbcode: path.resolve(__dirname, '../../src/features/comments-bbcode/inject/bbcode.ts'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: '{{title}}', replace: process.env.npm_package_name, flags: 'gi' },
            { search: '{{homepage}}', replace: process.env.npm_package_homepage, flags: 'gi' },
            { search: '{{author}}', replace: process.env.npm_package_author_name, flags: 'gi' },
            { search: '{{authorPage}}', replace: process.env.npm_package_author_url, flags: 'gi' },
            { search: '{{version}}', replace: process.env.npm_package_version, flags: 'gi' },
            { search: '{{bugs}}', replace: process.env.npm_package_bugs_url, flags: 'gi' },
          ],
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: '[name].bundle.js',
    path: OUTPUT_FOLDER,
  },
  plugins: [
    new CleanWebpackPlugin(
      [OUTPUT_FOLDER],
      { root: path.resolve(__dirname, '../../') },
    ),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../../src/manifest.json'),
        transform: function (content, path) {
          const manifest = JSON.parse(content.toString());
          manifest.version = process.env.npm_package_version;
          return Buffer.from(JSON.stringify(manifest));
        }
      },
    ]),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../../src/popup.html'),
      transform: function (content, path) {
        return Buffer.from(
          content.toString()
            .replace(/{{title}}/g, process.env.npm_package_name)
            .replace(/{{version}}/g, process.env.npm_package_version)
        );
      }
    }]),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, '../../src/assets') }]),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../../src/_locales'),
      to: '_locales',
    }]),
    // NPM dependencies
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, '../../node_modules/sceditor/minified/sceditor.min.js') }]),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, '../../node_modules/sceditor/minified/formats/bbcode.js') }]),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, '../../node_modules/tippy.js/dist/tippy.css') }]),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, '../../node_modules/tippy.js/dist/tippy.js') }]),
  ],
};
