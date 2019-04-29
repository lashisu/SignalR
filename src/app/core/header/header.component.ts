import { Component, OnInit } from '@angular/core';
import { HttpHelperService } from "../../utils/http-helper.service";
import { LocalStorageHelper } from "../../utils/local-storage";
import { CommunicationService } from '../../utils/comm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertComponent } from '../../shared/alert/alert.component';
import { LoginRegisterDialogComponent } from '../login-register-dialog/login-register-dialog.component';
import { MatDialog } from '@angular/material';
import { getLanguage } from 'src/app/utils/data.util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  Languages: any;
  SelectedLang: any = LocalStorageHelper.fetch('language');
  SelectedFlag: any = LocalStorageHelper.fetch('flag');
  userName: any = LocalStorageHelper.fetch('userName');
  firstName: any = LocalStorageHelper.fetch('firstName');
  domain: any = LocalStorageHelper.fetch('domain');
  CartCount: any = 0;
  getRequest$;

  constructor(
    private http: HttpHelperService,
    private router: Router,
    private communication: CommunicationService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    translate.addLangs(['en', 'th']);
    translate.use(LocalStorageHelper.fetch('language'));
  }

  ngOnInit() {
    this.Languages = getLanguage();
    if (LocalStorageHelper.fetch('token') != null && LocalStorageHelper.fetch('userName') != null) {
      this.BasketCount();
    }

    this.getRequest$ = this.communication.getRequest().subscribe((req) => {
      if (req == 'ShowUserArea') {
        this.userName = LocalStorageHelper.fetch('userName');
        this.firstName = LocalStorageHelper.fetch('firstName');
        this.BasketCount();
      }
      if (req == 'UpdateUserInfo') {
        this.userName = LocalStorageHelper.fetch('userName');
        this.firstName = LocalStorageHelper.fetch('firstName');
      }
    });

    this.translate.onLangChange.subscribe(() => {
      this.SelectedLang = LocalStorageHelper.fetch('language');
      this.SelectedFlag = LocalStorageHelper.fetch('flag');
      this.domain = LocalStorageHelper.fetch('domain');
    });
  }

  OpenLoginModal() {
    this.openLogin();
  }

  BasketCount() {
    this.http.get('Activity/v2/BasketCount').subscribe((resp: any) => {
      this.CartCount = resp.basketCount;
    });
  }

  Logout() {
    LocalStorageHelper.clear('token');
    LocalStorageHelper.clear('userId');
    LocalStorageHelper.clear('userName');
    LocalStorageHelper.clear('feedVersion');
    LocalStorageHelper.clear('firstName');
    this.userName = null;
    this.communication.sendRequest('openLogin');
    let Url = window.location.pathname;
    let TrimedUrl = Url.split('/');
    let isSecure = TrimedUrl.includes("secure");
    if (isSecure) {
      this.router.navigate(['/' + this.domain + '/feed']);
    }
  }

  ChangeLanguage(code, flag) {
    let domain = LocalStorageHelper.fetch('domain');
    let PageURL = decodeURI(window.location.href);
    let country = LocalStorageHelper.fetch('country');
    let CurrentPage = PageURL.split(domain);
    let PostData = {
      "uniqueDeviceIdentifier": "AngularWebApp",
      "platform": LocalStorageHelper.fetch('uniqueDeviceIdentifier'),
      "version": LocalStorageHelper.fetch('applicationVersion'),
      "deviceLanguage": code
    };
    if (LocalStorageHelper.fetch('token') != null && LocalStorageHelper.fetch('userName') != null) {
      this.http.post('Account/v1/UpdateUserDeviceInfo', PostData).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.ChangeLanguageSuccess(code, flag, country, CurrentPage);
        }
      });
    } else {
      this.ChangeLanguageSuccess(code, flag, country, CurrentPage);
    }
  }

  ChangeLanguageSuccess(code, flag, country, CurrentPage) {
    LocalStorageHelper.store('language', code);
    LocalStorageHelper.store('flag', flag);
    LocalStorageHelper.store('domain', country + '-' + code);
    this.SelectedFlag = flag;
    this.router.navigate([LocalStorageHelper.fetch('domain') + '/' + CurrentPage[1]]);
    this.translate.use(code);
  }

  openLogin() {
    if (LocalStorageHelper.fetch('token') == null && LocalStorageHelper.fetch('userId') == null) {
      const dialogRef = this.dialog.open(LoginRegisterDialogComponent, {
        width: '400px'
      });
    }
  }

  GetTranslatedTxt(key) {
    let aKey = '' + key;
    let txt = this.translate.instant(aKey || ' ');
    return txt.localizedText;
  }

  Alert(msg, type) {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px',
      disableClose: true,
      data: { msg: msg, type: type }
    });
  }

  ngOnDestroy(): void {
    this.getRequest$.unsubscribe();
  }
}
