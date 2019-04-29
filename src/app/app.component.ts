import { Component } from '@angular/core';
import { LocalStorageHelper } from "./utils/local-storage";
import { environment } from './../environments/environment.prod'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() { }

  ngOnInit() {
    LocalStorageHelper.store('ClientAuthentication', environment.ClientAuthentication);
    LocalStorageHelper.store('applicationVersion', environment.applicationVersion);
    LocalStorageHelper.store('applicationPlatformId', environment.applicationPlatformId);
    LocalStorageHelper.store('uniqueDeviceIdentifier', environment.uniqueDeviceIdentifier);
    LocalStorageHelper.store('FbVersion', environment.FbVersion);
    LocalStorageHelper.store('FbAppId', environment.FbAppId);
    LocalStorageHelper.store('language', environment.language);
    LocalStorageHelper.store('domain', environment.domain);
    LocalStorageHelper.store('token', environment.token);
    LocalStorageHelper.store('userId', environment.userId);
  }
}
