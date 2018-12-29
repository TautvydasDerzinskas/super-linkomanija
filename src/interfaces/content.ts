export default interface IContent {
  extendPageUserInterface?(): void;
  setupEventListeners?(): void;
  cleanUp(): void;
}
