import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable()
export class HttpHelperService {

    //private BASE_API = "https://live-api.chilindo.com.com/api/";
    //private BASE_API = "https://uat2-api.chilindo.com/api/";
    //private BASE_API = "https://dev-api.chilindo.com/api/";
    private BASE_API = "/api/";

    constructor(private http: HttpClient) { }

    private getUrl(url) {
        return `${this.BASE_API}${url}`;
    }

    get(url) {
        return this.http.get(this.getUrl(url));
    }

    get_wl(url, loader) {
        let params = new HttpParams().set('loader', loader);
        return this.http.get(this.getUrl(url), { params: params });
    }

    post(url, data) {
        return this.http.post(this.getUrl(url), data);
    }

    post_wl(url, data, loader) {
        let params = new HttpParams().set('loader', loader);
        return this.http.post(this.getUrl(url), data, { params: params });
    }

    delete(url, data) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        return this.http.request('DELETE', this.getUrl(url), {
            headers: headers,
            body: data
        });
    }

    put(page, url, data) {
        return this.http.put(this.getUrl(url), data);
    }
}