import IContent from '../../interfaces/content';

// The theme is switched by theme.ts, which runs at document start so the page never shows the other theme first.
// It follows the feature's stored status itself, so there is nothing to do once the page has loaded.
class ContentThemeSync implements IContent {}

export default new ContentThemeSync();
