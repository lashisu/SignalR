let country = [];
let language = [];
let category = [];
let userData;

export function setCountry(loaded: Array<any>) {
    country = loaded;
}

export function getCountry() {
    return [...country];
}

export function setLanguage(loaded: Array<any>) {
    language = loaded;
}

export function getLanguage() {
    return [...language];
}

export function setCategory(loaded: Array<any>) {
    category = loaded;
}

export function getCategory() {
    return [...category];
}

export function setUserData(loaded: any) {
    userData = loaded;
}

export function getUserData() {
    return userData;
}