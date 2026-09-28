export default class BrowserStorageService {
  constructor(private area: 'sync' | 'local' = 'sync') {}

  public async getItem<T>(storageKey: string): Promise<T> {
    const result = await chrome.storage[this.area].get(storageKey);
    return this.convertToJson<T>(result[storageKey] as string);
  }

  public async setItem<T>(storageKey: string, data: T) {
    await chrome.storage[this.area].set({ [storageKey]: this.convertToString<T>(data) });
    return true;
  }

  public convertToString<T>(jsonItem: T) {
    return JSON.stringify(jsonItem, null, 0);
  }

  public convertToJson<T>(stringifiedObject: string): T {
    try {
      return JSON.parse(stringifiedObject);
    } catch {
      return null;
    }
  }
}
