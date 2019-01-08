export default class ChromeStorageService {
  public getItem<T>(storageKey: string): Promise<T> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([storageKey], (result) => {
        let jsonData = null;

        try {
          jsonData = this.convertToJson<T>(result[storageKey]);
        } catch (e) {
          reject(e);
        }

        resolve(jsonData);
      });
    });
  }

  public setItem<T>(storageKey: string, data: T) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [storageKey]: this.convertToString<T>(data) }, () => {
        resolve(true);
      });
    });
  }

  public convertToString<T>(jsonItem: T) {
    return JSON.stringify(jsonItem).trim();
  }

  public convertToJson<T>(stringifiedObject: string): T {
    try {
      return JSON.parse(stringifiedObject);
    } catch (exception) {
      return null;
    }
  }
}
