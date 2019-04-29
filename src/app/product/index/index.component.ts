import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { HttpHelperService } from "../../utils/http-helper.service";
import { TranslateService } from '@ngx-translate/core';
import { CommunicationService } from '../../utils/comm.service';
import { ActivatedRoute } from "@angular/router";
import * as _moment from 'moment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  ProductId: any;
  ProductData: any;
  CurrencyCode: any;

  constructor(
    public translate: TranslateService,
    private http: HttpHelperService,
    private communication: CommunicationService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit() {
    this.ProductId = this.route.snapshot.params.product_id;
    console.log(this.ProductId);
    this.LoadProduct(this.ProductId);
  }

  LoadProduct(id) {
    this.http.post('Auction/v2/Auction', { "itemNumber": id }).subscribe((resp: any) => {
      this.CurrencyCode = LocalStorageHelper.fetch('currencyCode');
      this.ProductData = resp.responseModel;
    });
  }
}