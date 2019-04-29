import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { FacebookService, LoginResponse, LoginOptions } from 'ngx-facebook';
import { HttpHelperService } from "../../utils/http-helper.service";
import { MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDialogRef } from '@angular/material';
import { CommunicationService } from '../../utils/comm.service';
import { TranslateService } from '@ngx-translate/core';
import { getCountry, getLanguage, setUserData } from 'src/app/utils/data.util';

@Component({
  selector: 'app-login-register-dialog',
  templateUrl: './login-register-dialog.component.html',
  styleUrls: ['./login-register-dialog.component.scss']
})
export class LoginRegisterDialogComponent implements OnInit {
  SelectedLang: any = LocalStorageHelper.fetch('language');
  SelectedFlag: any = LocalStorageHelper.fetch('flag');

  Languages: any;

  CountryListSuggested: any = [];
  CountryListAll: any = [];

  SelectedModule: any = 'LoginWithFb';
  PickedLanguage: number;
  PickedCountry: number;
  PickedCountryFB: number;
  ShowCountryList: boolean = false;
  SelectedCountryName: any;

  loginform: FormGroup;
  LoginError: any = null;

  ForgotPasswordform: FormGroup;
  ForgotPasswordError: any = null;

  Registerform: FormGroup;
  RegisterErrors: any = [];

  hide = false;
  hideR = false;
  FB_LoginPost: any;

  constructor(
    private frmb: FormBuilder,
    private snackBar: MatSnackBar,
    private fb: FacebookService,
    private http: HttpHelperService,
    private router: Router,
    public dialogRef: MatDialogRef<LoginRegisterDialogComponent>,
    private communication: CommunicationService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.fb.init({
        appId: LocalStorageHelper.fetch('FbAppId'),
        version: LocalStorageHelper.fetch('FbVersion')
      });
      this.Languages = getLanguage();
      this.LoadCountryList();
    }, 2000);
    this.RegisterForm();
    this.LoginForm();
    this.ForgotPasswordForm();
  }

  LoadCountryList() {
    let CountryList = getCountry();
    CountryList.forEach(element => {
      if (element.isSuggestedCountry) {
        this.CountryListSuggested.push(element);
      } else {
        this.CountryListAll.push(element);
      }
    });
  }

  LoginForm() {
    this.loginform = this.frmb.group({
      userName: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });
  }

  RegisterForm() {
    this.Registerform = this.frmb.group({
      userName: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      country: ["", [Validators.required]],
      CountryName: [""]
    });
  }

  ForgotPasswordForm() {
    this.ForgotPasswordform = this.frmb.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  GetUserDetails() {
    this.http.post('Account/v1/Profile', {}).subscribe((resp: any) => {
      setUserData(resp);
      let domain = LocalStorageHelper.fetch('domain');
      LocalStorageHelper.store('feedVersion', resp.feedVersion);
      LocalStorageHelper.store('userName', resp.userName);
      LocalStorageHelper.store('firstName', resp.firstName);
      LocalStorageHelper.store('language', resp.language);
      LocalStorageHelper.store('country', resp.country);
      LocalStorageHelper.store('domain', resp.country + '-' + resp.language);
      let ToCompare = "/" + domain + "/";
      let Url = window.location.pathname;
      let TrimedUrl = Url.split(ToCompare);
      TrimedUrl.shift();
      this.communication.sendRequest('ShowUserArea');
      let AllCountry = getCountry();
      let curCont = AllCountry.filter(task => task.domainCode === resp.country);
      let SelectedCountryData = curCont[0];
      LocalStorageHelper.store('currencyCode', SelectedCountryData.currencyCode);
      LocalStorageHelper.store('feedRefreshTime', SelectedCountryData.feedRefreshTime_String);
      LocalStorageHelper.store('deliveryPriceInUserCurrency', SelectedCountryData.deliveryPriceInUserCurrency);
      LocalStorageHelper.store('minBidInUserCurrency', SelectedCountryData.minBidInUserCurrency);
      LocalStorageHelper.store('chilindoContactNumberPrefix', SelectedCountryData.chilindoContactNumberPrefix);
      LocalStorageHelper.store('chilindoContactNumber', SelectedCountryData.chilindoContactNumber);
      this.dialogRef.close();
      if (domain != (resp.country + '-' + resp.language)) {
        this.router.navigate([resp.country + '-' + resp.language + '/' + TrimedUrl[0]]);
      }
    }, (error: any) => {
      this.SnackBar(error.error.message);
    });
  }

  doLogin(form) {
    if (form.valid) {
      this.LoginError = [];
      let LoginData = {
        "language": LocalStorageHelper.fetch('language'),
        "userName": form.value.userName,
        "password": form.value.password,
        "uniqueDeviceIdentifier": LocalStorageHelper.fetch('uniqueDeviceIdentifier'),
        "applicationVersion": LocalStorageHelper.fetch('applicationVersion'),
        "applicationPlatformId": LocalStorageHelper.fetch('applicationPlatformId')
      };
      this.http.post('Account/v1/Login', LoginData).subscribe((resp: any) => {
        LocalStorageHelper.store('token', resp.token);
        LocalStorageHelper.store('userId', resp.userId);
        this.GetUserDetails();
      }, (error: any) => {
        this.LoginError.push(error.error.message);
      });
    }
  }

  doRegister(form) {
    if (form.valid) {
      this.RegisterErrors = [];
      let RegisterData = {
        "memberType": "",
        "firstName": "",
        "lastName": "",
        "postCode": 0,
        "phoneNumber": "",
        "country": form.value.country,
        "email": form.value.email,
        "password": form.value.password,
        "userName": form.value.userName,
        "facebookId": 0,
        "language": LocalStorageHelper.fetch('language'),
        "uniqueDeviceIdentifier": LocalStorageHelper.fetch('uniqueDeviceIdentifier'),
        "applicationPlatformId": LocalStorageHelper.fetch('applicationPlatformId'),
        "applicationVersion": LocalStorageHelper.fetch('applicationVersion'),
        "birthday": "",
        "gender": ""
      }
      this.http.post('Account/v1/Register', RegisterData).subscribe((resp: any) => {
        LocalStorageHelper.store('token', resp.token);
        LocalStorageHelper.store('userId', resp.userId);
        this.GetUserDetails();
      }, (error: any) => {
        error.error.errors.forEach(element => {
          this.RegisterErrors.push(element.errorMessage)
        });
      });
    }
  }

  WithLoginFacebook() {
    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'public_profile,email,user_birthday,user_gender,user_age_range'
    };
    this.fb.login(loginOptions)
      .then((res: LoginResponse) => {
        this.FB_LoginPost = {
          "userAccessToken": res.authResponse.accessToken,
          "language": LocalStorageHelper.fetch('language'),
          "uniqueDeviceIdentifier": LocalStorageHelper.fetch('uniqueDeviceIdentifier'),
          "applicationVersion": LocalStorageHelper.fetch('applicationVersion'),
          "applicationPlatformId": LocalStorageHelper.fetch('applicationPlatformId')
        };
        this.FacebookLogin(this.FB_LoginPost);
      }).catch((err: any) => {
        console.log('Error', err);
        this.SnackBar(err);
      });
  }

  FacebookLogin(LoginPost) {
    this.http.post('Account/v1/FacebookAppLogin', LoginPost).subscribe((resp: any) => {
      if (resp.isValid == undefined) {
        LocalStorageHelper.store('token', resp.token);
        LocalStorageHelper.store('userId', resp.userId);
        this.GetUserDetails();
      } else {
        this.SelectedModule == 'FB_Country';
      }
    }, (error: any) => {
      if (error.error.message == undefined) {
        if (!error.error.isValid) {
          if (error.error.errors[0].propertyName == 'Domain') {
            this.SelectedModule = 'FB_Country';
          }
        } else {
          this.SnackBar(error.message);
        }
      } else {
        this.SnackBar(error.error.message);
      }
    });
  }

  Select_Country_FB(domain) {
    this.FB_LoginPost.domain = domain;
    this.FacebookLogin(this.FB_LoginPost);
  }

  ResetPassword(form) {
    if (form.valid) {
      this.ForgotPasswordError = [];
      let PostData = {
        "email": form.value.email,
        "language": LocalStorageHelper.fetch('language'),
        "domain": LocalStorageHelper.fetch('domain')
      }
      this.http.post('Account/v1/ForgotPassword', PostData).subscribe((resp: any) => {
        this.ForgotPasswordError.push(resp.message);
      }, (error: any) => {
        error.error.errors.forEach(element => {
          this.ForgotPasswordError.push(element.errorMessage)
        });
      });
    }
  }

  ChangeLanguage(code, flag) {
    let country = LocalStorageHelper.fetch('country');
    let domain = LocalStorageHelper.fetch('domain');
    let PageURL = decodeURI(window.location.href);
    let CurrentPage = PageURL.split(domain);
    LocalStorageHelper.store('language', code);
    LocalStorageHelper.store('flag', flag);
    LocalStorageHelper.store('domain', country + '-' + code);
    this.SelectedFlag = flag;
    this.router.navigate([LocalStorageHelper.fetch('domain') + '/' + CurrentPage[1]]);
    this.translate.use(code);
  }

  SelectLanguage(i) {
    this.PickedLanguage = i;
  }

  ChangeCountry(countryName, domainCode, countryNameLocal) {
    this.Registerform.get('CountryName').setValue(countryName + ' | ' + countryNameLocal);
    this.Registerform.get('country').setValue(domainCode);
  }

  GetTranslatedTxt(key) {
    let aKey = '' + key;
    let txt = this.translate.instant(aKey || ' ');
    return txt.localizedText;
  }

  SnackBar(Message) {
    this.snackBar.open(Message, 'X', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
