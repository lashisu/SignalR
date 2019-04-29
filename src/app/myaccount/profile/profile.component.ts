import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { HttpHelperService } from "../../utils/http-helper.service";
import { FormGroup, Validators, FormBuilder, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertComponent } from '../../shared/alert/alert.component';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { CommunicationService } from '../../utils/comm.service';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { getCountry } from 'src/app/utils/data.util';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM-DD-YYYY'
  },
  display: {
    dateInput: 'MM-DD-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM-DD-YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ProfileComponent implements OnInit {
  UserInfo: any;
  CreditInfo: any;
  //WelcomeTime: any;

  PersonalForm: FormGroup;
  CountryForm: FormGroup;

  AddressControl: any;
  AddressForm: FormGroup;

  PostalCode: any = [];
  Province: any = [];
  District: any = [];
  SubDistrict: any = [];

  Countries: any;
  CountryListSuggested: any = [];
  CountryListAll: any = [];
  Languages: any = [];

  AddressData: any = {};
  AddressList: any = [];
  ShowAddressControl: boolean = false;
  PhonePatternMsg: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private http: HttpHelperService,
    private communication: CommunicationService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.InitPersonalForm();
    this.InitCountryForm();
    // let today = new Date()
    // let curHr = today.getHours()
    // if (curHr < 12) {
    //   this.WelcomeTime = 'Good Morning!';
    // } else if (curHr < 18) {
    //   this.WelcomeTime = 'Good Afternoon!';
    // } else {
    //   this.WelcomeTime = 'Good Evening!';
    // }

    this.http.get('Refund/v1/GetCreditInfo').subscribe((resp: any) => {
      this.CreditInfo = resp;
      this.PersonalForm.get('userName').enable();
    });

    this.http.post('Account/v1/Profile', {}).subscribe((resp: any) => {
      this.UserInfo = resp;
      this.InitUserData(resp);
    });

    this.Countries = LocalStorageHelper.fetchData('Countries');
    this.Countries.forEach(element => {
      if (element.isSuggestedCountry) {
        this.CountryListSuggested.push(element);
      } else {
        this.CountryListAll.push(element);
      }
    });

    this.Languages = LocalStorageHelper.fetchData('Languages');
    this.GetAddressList();

    this.translate.onLangChange.subscribe(() => {
      this.CountryForm.get('country').setValue(LocalStorageHelper.fetch('country'));
      this.CountryForm.get('deviceLanguage').setValue(LocalStorageHelper.fetch('language'));
    });

    this.GetPostalCode();
  }


  GetAddressList() {
    this.http.post('Address/v1/GetAddressList', { "accountId": 0, "domain": LocalStorageHelper.fetch('country'), "language": LocalStorageHelper.fetch('language') }).subscribe((resp: any) => {
      this.AddressList = resp;
      this.AddressList.sort(function (x, y) {
        return (x.isdefault === y.isdefault) ? 0 : x.isdefault ? -1 : 1;
      });
    });
  }

  SetAsDefault(accountId, addressId) {
    this.http.post('Address/v1/SetRemoveDefaultAddress', { "accountId": accountId, "addressId": addressId, "isDefault": true }).subscribe((resp: any) => {
      this.GetAddressList();
    });
  }

  AddEdit(id) {
    let PostData = {
      "addressId": id,
      "domain": LocalStorageHelper.fetch('country'),
      "language": LocalStorageHelper.fetch('language'),
      "accountId": 0,
      "isCheckoutRequest": false
    }

    this.http.post('Address/v1/GetAddressControl', PostData).subscribe((resp: any) => {
      if (resp.isValid) {
        this.AddressData = {};
        this.ShowAddressControl = true;
        this.AddressControl = resp.addressControl;
        this.AddressForm = this.toFormGroup(resp.addressControl, PostData);
        this.Province = [];
        this.District = [];
        this.SubDistrict = [];
        if (id == '0') {
          if (this.AddressForm.get('province')) { this.AddressForm.get('province').setValue('') };
          if (this.AddressForm.get('district')) { this.AddressForm.get('district').setValue('') };
          if (this.AddressForm.get('districtsub')) { this.AddressForm.get('districtsub').setValue('') };
        } else {
          this.ChangePostcode(id);
          this.ChangeDistrict(id);
          this.ChangeProvince(id);
          if (this.AddressForm.get('province')) { this.AddressForm.get('province').setValue(this.AddressData['province']) };
          if (this.AddressForm.get('district')) { this.AddressForm.get('district').setValue(this.AddressData['district']) };
          if (this.AddressForm.get('districtsub')) { this.AddressForm.get('districtsub').setValue(this.AddressData['districtsub']) };
        }
      }
    });
  }

  SaveAddress(form) {
    if (form.valid) {
      this.http.post('Address/v1/AddEditAddress', form.value).subscribe((resp: any) => {
        this.ShowAddressControl = false;
        this.GetAddressList();
      });
    }
  }

  DeleteAddress(id) {
    let PostData = { "accountId": LocalStorageHelper.fetch('userId'), "addressId": id };
    this.Confirm('DeleteAddress', 'Are you sure to detele this address?', 'Address/v1/DeleteAddress', PostData, 'Address deleted successfully!', 'Something went wrong, try after sometime!');
  }

  toFormGroup(data, PostData) {
    let group: any = {};
    data.forEach(element => {
      if (PostData.addressId != 0) {
        this.AddressData[element.fieldIdentity] = element.fieldValue;
      }
      if (element.fieldIdentity == 'phone') {
        group[element.fieldIdentity] = element.isRequired ? new FormControl(element.fieldValue || '', [Validators.required, Validators.pattern(this.PhoneNumberPattern(LocalStorageHelper.fetch('country')))]) : new FormControl(element.fieldValue || '');
      } else if (element.fieldIdentity == 'isdefault') {
        group[element.fieldIdentity] = element.isRequired ? new FormControl(element.fieldValue == 'True' ? true : false || false, [Validators.required, Validators.pattern(this.PhoneNumberPattern(LocalStorageHelper.fetch('country')))]) : new FormControl(element.fieldValue == 'True' ? true : false || false);
      } else {
        group[element.fieldIdentity] = element.isRequired ? new FormControl(element.fieldValue || '', Validators.required) : new FormControl(element.fieldValue || '');
      }
    });
    group['accountId'] = new FormControl(PostData.accountId);
    group['language'] = new FormControl(PostData.language);
    group['addressId'] = new FormControl(PostData.addressId);
    group['isActive'] = new FormControl(true);
    group['placesId'] = new FormControl(0);
    return new FormGroup(group);
  }

  GetPostalCode() {
    this.http.post('Address/v1/GetPostcode', { "domain": LocalStorageHelper.fetch('country') }).subscribe((resp: any) => {
      this.PostalCode = resp;
    });
  }

  ChangePostcode(id) {
    let FormData = {
      "domain": LocalStorageHelper.fetch('country'),
      "language": LocalStorageHelper.fetch('language'),
      "parameter1": this.AddressForm.get('postcode').value,
      "parameter2": ""
    };
    this.http.post('Address/v1/GetProvince', FormData).subscribe((resp: any) => {
      this.Province = resp;
      if (!id) {
        this.District = [];
        this.SubDistrict = [];
        this.AddressForm.get('province').setValue('');
        this.AddressForm.get('district').setValue('');
        this.AddressForm.get('districtsub').setValue('');
      }
    });
  }

  ChangeProvince(id) {
    let FormData = {
      "domain": LocalStorageHelper.fetch('country'),
      "language": LocalStorageHelper.fetch('language'),
      "parameter1": this.AddressForm.get('postcode').value,
      "parameter2": this.AddressForm.get('province').value
    };
    this.http.post('Address/v1/GetDistrict', FormData).subscribe((resp: any) => {
      this.District = resp;
      if (!id) {
        this.SubDistrict = [];
        this.AddressForm.get('district').setValue('');
        this.AddressForm.get('districtsub').setValue('');
      }
    });
  }

  ChangeDistrict(id) {
    let FormData = {
      "domain": LocalStorageHelper.fetch('country'),
      "language": LocalStorageHelper.fetch('language'),
      "parameter1": this.AddressForm.get('postcode').value,
      "parameter2": this.AddressForm.get('district').value
    };
    this.http.post('Address/v1/GetSubDistrict', FormData).subscribe((resp: any) => {
      this.SubDistrict = resp;
      if (!id) {
        this.AddressForm.get('districtsub').setValue('');
      }
    });
  }

  PhoneNumberPattern(domain: string) {
    this.PhonePatternMsg = this.PatternMsg(domain);
    switch (domain) {
      case "th": return '^[0][1-9].{8}$'
      case "dk": case "no": return '^[0][1-9].{6}$'
      case "sg": case "my": case "au": case "de": case "cn": case "it": return '^[0][1-9].{5}$'
      case "vn": return '^[0][1-9].{4}$'
      default: return '^[0-9][0-9].{8}$'
    }
  }

  PatternMsg(domain: string) {
    this.PhonePatternMsg = 'Invalid Number for ' + domain + '!';
    switch (domain) {
      case "th": return '10 digit number Start with 0!'
      case "dk": case "no": return '7 digit number Start with 0!'
      case "sg": case "my": case "au": case "de": case "cn": case "it": return '6 digit number Start with 0!'
      case "vn": return '5 digit number Start with 0!'
      default: return '10 digit number!'
    }
  }

  InitUserData(resp) {
    this.PersonalForm.get('userName').setValue(resp.userName);
    this.PersonalForm.get('userName').enable();
    this.PersonalForm.get('firstName').setValue(resp.firstName);
    this.PersonalForm.get('lastName').setValue(resp.lastName);
    this.PersonalForm.get('gender').setValue(resp.gender);
    this.PersonalForm.get('dateOfBirth').setValue(resp.birthday);
    this.PersonalForm.get('email').setValue(resp.email);
    this.PersonalForm.get('email').disable();
    this.PersonalForm.get('phone').setValue(resp.phoneNumber);
    this.PersonalForm.get('lineId').setValue(resp.lineId);
    if (resp.isFacebookUser) {
      this.PersonalForm.get('gender').disable();
      this.PersonalForm.get('dateOfBirth').disable();
      this.PersonalForm.get('fake').disable();
    }
    this.CountryForm.get('country').setValue(resp.country);
    this.CountryForm.get('deviceLanguage').setValue(resp.language);
  }

  InitPersonalForm() {
    this.PersonalForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.minLength(1)]],
      lastName: ['', [Validators.minLength(1)]],
      gender: [''],
      dateOfBirth: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      lineId: [''],
      fake: ['.']
    });
  }

  InitCountryForm() {
    this.CountryForm = this.fb.group({
      country: ['', [Validators.required]],
      deviceLanguage: ['', [Validators.required]]
    });
  }

  UpdateCountry(form) {
    if (form.valid) {
      this.http.post('Account/v1/UpdateCountry', form.value).subscribe((resp: any) => {
        if (resp.success) {
          let domain = LocalStorageHelper.fetch('domain');
          let PageURL = decodeURI(window.location.href);
          let CurrentPage = PageURL.split(domain);
          LocalStorageHelper.store('language', form.value.deviceLanguage);
          LocalStorageHelper.store('country', form.value.country);
          LocalStorageHelper.store('flag', '/gfx/flags/' + form.value.deviceLanguage + '.png');
          LocalStorageHelper.store('domain', form.value.country + '-' + form.value.deviceLanguage);

          let AllCountry = getCountry();
          let curCont = AllCountry.filter(task => task.domainCode === resp.country);
          let SelectedCountryData = curCont[0];
          LocalStorageHelper.store('currencyCode', SelectedCountryData.currencyCode);
          LocalStorageHelper.store('feedRefreshTime', SelectedCountryData.feedRefreshTime_String);
          LocalStorageHelper.store('deliveryPriceInUserCurrency', SelectedCountryData.deliveryPriceInUserCurrency);
          LocalStorageHelper.store('minBidInUserCurrency', SelectedCountryData.minBidInUserCurrency);
          LocalStorageHelper.store('chilindoContactNumberPrefix', SelectedCountryData.chilindoContactNumberPrefix);
          LocalStorageHelper.store('chilindoContactNumber', SelectedCountryData.chilindoContactNumber);

          this.router.navigate([form.value.country + '-' + form.value.deviceLanguage + '/' + CurrentPage[1]]);
          this.translate.use(form.value.deviceLanguage);
        } else {
          this.Alert(resp.message, 'error');
        }
      }, (error: any) => {
        error.error.errors.forEach(element => {
          this.Alert(element.errorMessage, 'error');
        });
      });
    }
  }

  UpdatePersonalInfo(form) {
    if (form.valid) {
      if (this.UserInfo.isFacebookUser) {
        this.PersonalForm.get('dateOfBirth').enable();
      }
      let NewDate = (new Date(new Date(form.value.dateOfBirth).toString().split('GMT')[0] + ' UTC').toISOString()).valueOf();
      this.PersonalForm.get('dateOfBirth').setValue(NewDate);
      if (this.UserInfo.userName == form.value.userName) {
        this.PersonalForm.get('userName').disable();
      }
      this.http.post('Account/v1/Update', form.value).subscribe((resp: any) => {
        this.UserInfo = resp;
        this.InitUserData(resp);
        LocalStorageHelper.store('firstName', resp.firstName);
        this.communication.sendRequest('UpdateUserInfo');

        this.Alert('Your profile has been updated!', 'success');
      }, (error: any) => {
        error.error.errors.forEach(element => {
          this.Alert(element.errorMessage, 'error');
        });
      });
    }
  }

  Alert(msg, type) {
    this.dialog.open(AlertComponent, {
      width: '400px',
      data: { msg: msg, type: type }
    });
  }

  Confirm(action, confirm_msg, url, PostData, success_msg, error_msg) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      disableClose: true,
      data: { msg: confirm_msg }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post(url, PostData).subscribe((resp: any) => {
          if (resp.isValid) {
            this.Alert(success_msg, 'success');
            if (action == 'DeleteAddress') {
              this.GetAddressList();
            }
          } else {
            this.Alert(error_msg, 'error');
          }
        });
      }
    });
  }
}