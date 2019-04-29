import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { HttpHelperService } from "../../utils/http-helper.service";
import { AlertComponent } from '../../shared/alert/alert.component';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: any;
  NoItemInCart: boolean = false;
  SideCart: boolean = false;
  domain: any = LocalStorageHelper.fetch('domain');
  AllCountry: any = LocalStorageHelper.fetchData('Countries');
  userCountry: any = LocalStorageHelper.fetch('country');
  SelectedCountryData: any;

  constructor(
    private router: Router,
    private http: HttpHelperService,
    public translate: TranslateService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    let curCont = this.AllCountry.filter(task => task.domainCode === this.userCountry);
    this.SelectedCountryData = curCont[0];

    this.LoadCart();
    this.translate.onLangChange.subscribe(() => {
      this.LoadCart();
    });
  }

  LoadCart() {
    this.http.post('Activity/v3/Basket', { "language": LocalStorageHelper.fetch('language') }).subscribe((resp: any) => {
      if (resp.cartInfo.length == 0) {
        this.NoItemInCart = true;
      } else {
        this.SideCart = true;
      }
      this.cart = resp;
    });
  }

  ChangeQuantity(type, itemIndex) {
    if (type == 'reduce') {
      if (this.cart.cartInfo[itemIndex].quantitySelected > 1) {
        this.cart.cartInfo[itemIndex].quantitySelected = this.cart.cartInfo[itemIndex].quantitySelected - 1;
      }
    } else {
      if (this.cart.cartInfo[itemIndex].quantitySelected < this.cart.cartInfo[itemIndex].quantityToShow) {
        this.cart.cartInfo[itemIndex].quantitySelected = this.cart.cartInfo[itemIndex].quantitySelected + 1;
      }
    }
    let POST_DATA =
    {
      "platform": LocalStorageHelper.fetch('applicationPlatformId'),
      "appVersion": LocalStorageHelper.fetch('applicationVersion'),
      "language": LocalStorageHelper.fetch('language'),
      "auctionId": this.cart.cartInfo[itemIndex].auctionId,
      "oldItemNo": this.cart.cartInfo[itemIndex].itemNumber,
      "newItemNo": "",
      "requestedQuantity": this.cart.cartInfo[itemIndex].quantitySelected,
      "isCategoryChange": false,
      "saleId": this.cart.cartInfo[itemIndex].saleId
    };
    this.UpdateCartItem(POST_DATA);
  }

  ChangeCategory(e, itemIndex) {
    let POST_DATA =
    {
      "platform": LocalStorageHelper.fetch('applicationPlatformId'),
      "appVersion": LocalStorageHelper.fetch('applicationVersion'),
      "language": LocalStorageHelper.fetch('language'),
      "auctionId": this.cart.cartInfo[itemIndex].auctionId,
      "oldItemNo": this.cart.cartInfo[itemIndex].itemNumber,
      "newItemNo": e.value,
      "requestedQuantity": this.cart.cartInfo[itemIndex].quantitySelected,
      "isCategoryChange": true,
      "saleId": this.cart.cartInfo[itemIndex].saleId
    };
    this.UpdateCartItem(POST_DATA);
  }

  InStockCheck(date) {
    var CurrentMonth = new Date().getUTCMonth();
    var CurrentDate = new Date().getUTCDate();
    var CurrentYear = new Date().getUTCFullYear();
    var GivenMonth = new Date(date).getUTCMonth();
    var GivenDate = new Date(date).getUTCDate();
    var GivenYear = new Date(date).getUTCFullYear();
    var currentTime = new Date(Date.UTC(CurrentYear, CurrentMonth, CurrentDate, 0, 0, 0));
    var givenTime = new Date(Date.UTC(GivenYear, GivenMonth, GivenDate, 0, 0, 0));
    if (givenTime.getTime() < currentTime.getTime()) {
      return false;
    } else {
      return true;
    }
  }

  MyPlaceHolder(key, obj) {
    let aKey = '' + key;
    let txt = this.translate.instant(aKey || ' ');
    let str = txt.localizedText;
    if (str) {
      let parameter = txt.parameters.split(' ');
      if (obj) {
        for (let i = 0; i < obj.length; i++) {
          let temp = str;
          temp = temp.replace(parameter[i], obj[i]);
          str = temp;
        }
      }
    }
    return str;
  }

  UpdateCartItem(data) {
    console.log(data);
    this.http.post('Activity/v1/UpdateCart', data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isValid) {
        this.Alert(resp.message, 'success');
      } else {
        this.Alert(resp.message, 'error');
      }
      this.LoadCart();
    });
  }

  MatOption(n: number): any[] {
    return Array(n);
  }

  Alert(msg, type) {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px',
      disableClose: true,
      data: { msg: msg, type: type }
    });
  }
}
