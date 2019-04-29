import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { HttpHelperService } from "../../utils/http-helper.service";
import { TranslateService } from '@ngx-translate/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-myauctions',
  templateUrl: './myauctions.component.html',
  styleUrls: ['./myauctions.component.scss']
})
export class MyauctionsComponent implements OnInit {

  domain: any = LocalStorageHelper.fetch('domain');

  BidHistory: any = [];
  NoBidHistory: boolean = false;

  BidWonHistory: any = [];
  NoBidWonHistory: boolean = false;

  BidLostHistory: any = [];
  NoBidLostHistory: boolean = false;

  constructor(
    private router: Router,
    private http: HttpHelperService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.http.get('Activity/v1/BidHistory').subscribe((resp: any) => {
      if (resp.length > 0) {
        this.NoBidHistory = false;
      } else {
        this.NoBidHistory = true;
      }
      this.BidHistory = resp;
    });

    this.http.get('Activity/v1/BidWonHistory').subscribe((resp: any) => {
      if (resp.length > 0) {
        this.NoBidWonHistory = false;
      } else {
        this.NoBidWonHistory = true;
      }
      this.BidWonHistory = resp;
    });

    this.http.get('Activity/v1/BidLostHistory').subscribe((resp: any) => {
      if (resp.length > 0) {
        this.NoBidLostHistory = false;
      } else {
        this.NoBidLostHistory = true;
      }
      this.BidLostHistory = resp;
    });
  }

  GoToProduct(itemNumber) {
    let url = "/" + LocalStorageHelper.fetch('domain') + "/product/" + itemNumber;
    this.router.navigate([url]);
  }

  GoToProductAuction(itemNumber, auctionId) {
    let url = "/" + LocalStorageHelper.fetch('domain') + "/product/" + itemNumber;
    this.router.navigate([url], { queryParams: { aucid: auctionId } });
  }

  GoToAuction(auctionId) {
    let url = "/" + LocalStorageHelper.fetch('domain') + "/auction/" + auctionId;
    this.router.navigate([url], { queryParams: { GoNext: 'No' } });
  }
}