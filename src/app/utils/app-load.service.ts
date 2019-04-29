import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageHelper } from "./../utils/local-storage";
import { setCountry, setLanguage, setCategory } from './data.util';
import 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppLoadService {
  constructor(private http: HttpClient) { }
  GetGeoLocation(): Promise<any> {
    if (LocalStorageHelper.fetch('language') == null && LocalStorageHelper.fetch('domain') == null) {
      return new Promise((resolve, reject) => {
        this.http.get('/api/Language/v1/GeoLocation').subscribe((CultureInfo: any) => {
          this.SetLocal(CultureInfo);
          this.http.get('/api/Language/v2/Countries').subscribe((resp: any) => {
            this.SetData(resp);
            this.http.get('/api/Language/v1/Languages').subscribe((resp: any) => {
              setLanguage(resp);
              resolve(true);
            });
          });
        }, (err) => {
          reject(false);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.http.get('/api/Language/v1/GeoLocation').subscribe((CultureInfo: any) => {
          this.SetLocal(CultureInfo);
          this.http.get('/api/Language/v2/Countries').subscribe((resp: any) => {
            this.SetData(resp);
            this.http.get('/api/Language/v1/Languages').subscribe((resp: any) => {
              setLanguage(resp);
              resolve(true);
            });
          });
        }, (err) => {
          reject(false);
        });
      });
    }
  }

  SetLocal(CultureInfo) {
    LocalStorageHelper.store('country', CultureInfo.countryIsoCode);
    LocalStorageHelper.store('language', this.GetLanguage(CultureInfo.countryIsoCode));
    LocalStorageHelper.store('domain', CultureInfo.countryIsoCode + '-' + this.GetLanguage(CultureInfo.countryIsoCode));
    LocalStorageHelper.store('flag', '/gfx/flags/' + this.GetLanguage(CultureInfo.countryIsoCode) + '.png');
  }

  SetData(resp) {
    let userCountry = LocalStorageHelper.fetch('country');
    let curCont = resp.filter(task => task.domainCode === userCountry);
    let SelectedCountryData = curCont[0];
    LocalStorageHelper.store('currencyCode', SelectedCountryData.currencyCode);
    LocalStorageHelper.store('feedRefreshTime', SelectedCountryData.feedRefreshTime_String);
    LocalStorageHelper.store('deliveryPriceInUserCurrency', SelectedCountryData.deliveryPriceInUserCurrency);
    LocalStorageHelper.store('minBidInUserCurrency', SelectedCountryData.minBidInUserCurrency);
    LocalStorageHelper.store('chilindoContactNumberPrefix', SelectedCountryData.chilindoContactNumberPrefix);
    LocalStorageHelper.store('chilindoContactNumber', SelectedCountryData.chilindoContactNumber);
    setCountry(resp);
  }

  GetLanguage(code: string) {
    switch (code) {
      case "th": return 'th'
      case "en": return 'en'
      case "my": return 'ms'
      case "cn": return 'zh'
      case "no": return 'no'
      case "vn": return 'vi'
      default: return 'en'
    }
  }
}