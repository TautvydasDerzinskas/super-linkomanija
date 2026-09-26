# Contributing to Super Linkomanija

Everyone is welcome to contribute to the project or use the code for their own projects.

## Table of contents
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Loading the extension in a browser](#loading-the-extension-in-a-browser)
- [Project structure](#project-structure)
- [Adding a feature](#adding-a-feature)
- [Code quality](#code-quality)
- [Commits](#commits)
- [Releases](#releases)

## Prerequisites
- [Node.js](https://nodejs.org) 24 (the exact version is in `.nvmrc`, so `nvm use` picks it up)
- Chrome, Edge or Firefox 142+ for testing

## Getting started
1. Run `npm install` to install dependencies. This also sets up the git hooks.
2. Build the extension:

| Command | Output |
| --- | --- |
| `npm run develop` | Chrome and Edge build in watch mode, into `extension/` |
| `npm run develop:firefox` | Firefox build in watch mode, into `extension-firefox/` |
| `npm run build` | Chrome and Edge production build, into `extension/` |
| `npm run build:firefox` | Firefox production build, into `extension-firefox/` |

Chrome and Edge share the same build. The Firefox build differs only in its manifest.

## Loading the extension in a browser
- **Chrome**: open `chrome://extensions`, enable **Developer mode** and choose **Load unpacked** with the `extension` folder.
- **Edge**: open `edge://extensions`, enable **Developer mode** and choose **Load unpacked** with the `extension` folder.
- **Firefox**: open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on** and select `extension-firefox/manifest.json`.

After a rebuild, reload the extension on that page and refresh the linkomanija.net tab.

If the store version of the extension is also installed, disable it while testing. Otherwise both copies run and everything appears twice on the page.

## Project structure
```
src/
├── manifest.json        Manifest V3, the version is filled in from package.json at build time
├── background.ts        Service worker (event page in Firefox): toolbar icon and default settings
├── content.ts           Runs on linkomanija.net pages and starts the enabled features
├── popup.tsx            Popup entry, React app in src/popup/
├── features/            One folder per feature, see below
├── services/            Shared logic (storage, API calls to linkomanija.net, browser detection)
└── assets/_locales/     English and Lithuanian texts, used by both the manifest and the popup
config/
├── webpack/             Build configuration for both browser targets
└── release/             Store publishing scripts used by semantic-release
```

## Adding a feature
1. Create `src/features/<feature-name>/` with:
   - `meta.ts`: the feature's ID, title and description keys, whether it's on by default and the browsers it's excluded from
   - `content.ts`: a class implementing `IContent`, which adds the feature to the page (`extendPageUserInterface`, `setupEventListeners`) and removes it again (`cleanUp`)
   - `styles/` for its SCSS, imported from `content.ts`
2. Register the meta in `src/features/features-meta.ts` and the content in `src/features/features.ts`, keeping the same order in both.
3. Add the title and description texts to both `src/assets/_locales/en/messages.json` and `src/assets/_locales/lt/messages.json`.

The feature then shows up in the popup's settings with an on/off switch, and the switch applies to open tabs straight away.

## Code quality
- `npm run lint` runs [oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- `npm run typecheck` runs the TypeScript compiler

Both run automatically before every commit and in CI on every push and pull request.

## Commits
Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org), because releases are generated from them. A `commit-msg` hook checks every message.

Run `npm run commit` for an interactive prompt, or write the message yourself:

```
feat(view-modes): remember the grid size
fix(torrent-preview): show the preview for torrents without a description
```

Common scopes are the feature names (`view-modes`, `torrent-preview`, `comments-bbcode`, `related-torrents`, `back-to-top`, `homepage-redirect`), plus `history` and `core`.

## Releases
Releases are fully automated with [semantic-release](https://github.com/semantic-release/semantic-release). Every push to `main` is checked. When it contains releasable commits, a new version is published:

| Commit | Version change |
| --- | --- |
| `fix:` or `perf:` | patch, for example 2.0.0 → 2.0.1 |
| `feat:` | minor, for example 2.0.0 → 2.1.0 |
| `BREAKING CHANGE:` in the commit body | major, for example 2.0.0 → 3.0.0 |
| `chore:`, `ci:`, `docs:`, `refactor:`, `build:`, `style:`, `test:` | no release |

A release:
1. updates the version in `package.json` and adds the changes to `CHANGELOG.md`
2. builds the Chrome/Edge and Firefox packages
3. commits the version bump and tags it
4. publishes to the Chrome Web Store, Microsoft Edge Add-ons and Firefox Add-ons (with the source code Mozilla requires for review)
5. creates a GitHub release with both packages attached

Each store still reviews the new version before users get it. A store refuses a new upload while it's reviewing the previous one, so avoid releasing again until the pending reviews are finished.

Publishing uses these repository secrets, which only the maintainer can manage:

| Store | Secrets |
| --- | --- |
| Chrome Web Store | `CWS_SERVICE_ACCOUNT_KEY`, `CWS_PUBLISHER_ID` |
| Microsoft Edge Add-ons | `EDGE_PRODUCT_ID`, `EDGE_CLIENT_ID`, `EDGE_API_KEY` |
| Firefox Add-ons | `WEB_EXT_API_KEY`, `WEB_EXT_API_SECRET` |
