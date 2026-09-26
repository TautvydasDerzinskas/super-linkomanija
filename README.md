<p align="center">
  <a href="https://github.com/TautvydasDerzinskas/super-linkomanija"><img src="docs/images/sl_promo_440x280.jpg" alt="browser extension: Super Linkomanija" title="Browser extension: Super Linkomanija" width="250px" /></a>
</p>

<p align="center">
  <a href="https://github.com/TautvydasDerzinskas/super-linkomanija/actions/workflows/ci.yml" target="_blank"><img src="https://github.com/TautvydasDerzinskas/super-linkomanija/actions/workflows/ci.yml/badge.svg?branch=main" alt="Latest CI build status" title="Latest CI build status"></a>
  <a href="https://github.com/TautvydasDerzinskas/super-linkomanija" target="_blank"><img src="https://img.shields.io/chrome-web-store/users/gmdhkalbljdblbogfladannflinppnji.svg?label=users" alt="Active users" title="Active users"></a>
  <a href="http://commitizen.github.io/cz-cli" target="_blank"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly" title="Commitizen friendly"></a>
  <a href="https://github.com/semantic-release/semantic-release" target="_blank"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="Semantic release" title="Semantic release"></a>
  <a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" title="MIT License"></a>
</p>

## Table of content
- [About](#about)
- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Road map](#road-map)
- [Development](#development)
- [License](#license)

## About
Browser extension with purpose to extend UX of oldest Lithuanian torrent web site http://www.linkomanija.net

## Features
1. Comment formatting
2. Torrent preview
3. Torrents view modes (list/grid)
4. Homepage redirect
5. Quick back to top
6. Related torrents

## Screenshots
<a href="docs/images/screenshot_01.jpg" target="_blank"><img width="200px" src="docs/images/screenshot_01.jpg" alt="Screenshot" title="Screenshot" /></a><a href="docs/images/screenshot_02.jpg" target="_blank"><img width="200px" src="docs/images/screenshot_02.jpg" alt="Screenshot" title="Screenshot" /></a><a href="docs/images/screenshot_03.jpg" target="_blank"><img width="200px" src="docs/images/screenshot_03.jpg" alt="Screenshot" title="Screenshot" /></a><a href="docs/images/screenshot_04.jpg" target="_blank"><img width="200px" src="docs/images/screenshot_04.jpg" alt="Screenshot" title="Screenshot" /></a>

## Installation
Chrome & Vivaldi users please click below:

<a href="https://chromewebstore.google.com/detail/gmdhkalbljdblbogfladannflinppnji" target="_blank">
  <img src="docs/images/chrome_store.png" alt="Available in the Chrome Web Store" />
</a>

Firefox users please head to link below:

<a href="https://addons.mozilla.org/en-GB/firefox/addon/super-linkomanija/" target="_blank">
  <img src="docs/images/firefox_store.png" width="206px" alt="Get the add-on for Firefox" />
</a>

## Road map
* Add more features

## Development
Everyone is welcomed to contribute to the project or use the code for their own projects

To contribute you need to perform these steps:
1. Use Node.js 24 (see `.nvmrc`) and run `npm install` to install npm dependencies
2. Run `npm run develop` to build in watch mode (or `npm run build` for a production build) into the `extension` folder
3. In your browser extensions window enable developer mode and load the unpacked extension from the `extension` folder (Manifest V3)
4. Run `npm run lint` (oxlint) and `npm run typecheck` to make sure code is valid, both also run on pre-commit
5. Commit with `npm run commit`, messages must follow [Conventional Commits](https://www.conventionalcommits.org) since releases are generated from them

## License
The repository code is open-sourced software licensed under the [MIT license](https://github.com/TautvydasDerzinskas/super-linkomanija/blob/main/LICENSE?raw=true).
