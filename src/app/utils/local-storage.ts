export class LocalStorageHelper {

    static storeData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static fetchData(key) {
        let data = localStorage.getItem(key);
        if (data) {
            return  JSON.parse(data);
        } else {
            return null;
        }
    }

    static store(key, value) {
        localStorage.setItem(key, value);
    }

    static fetch(key) {
        let data = localStorage.getItem(key);
        if (data) {
            return  data;
        } else {
            return null;
        }
    }

    static clearAll() {
        localStorage.clear();
    }

    static clear(key) {
        localStorage.removeItem(key);
    }
}