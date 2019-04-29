import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { HttpHelperService } from "../../utils/http-helper.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  cart: any;
  SideCart: boolean = false;
  constructor(
    private http: HttpHelperService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.LoadCart();
    this.translate.onLangChange.subscribe(() => {
      this.LoadCart();
    });
  }
  LoadCart() {
    this.http.post('Activity/v3/Basket', { "language": LocalStorageHelper.fetch('language') }).subscribe((resp: any) => {
      if (resp.cartInfo.length == 0) {
        this.SideCart = false;
      } else {
        this.SideCart = true;
      }
      this.cart = resp;
    });
  }
}