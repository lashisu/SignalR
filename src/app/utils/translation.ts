import { Injectable } from '@angular/core';
import { LocalStorageHelper } from "./local-storage";
import { HttpHelperService } from "./http-helper.service";
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TranslationService implements TranslateLoader {
  constructor(private http: HttpHelperService) { }
  getTranslation(): Observable<any> {
    return this.http.post('Language/v1/PageText', { 'name': 'ALL', language: LocalStorageHelper.fetch('language'), domain: LocalStorageHelper.fetch('country') })
      .pipe(map((response: any) => response));
  }
}