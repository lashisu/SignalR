import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { HttpHelperService } from "../../utils/http-helper.service";
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  OrderInfo: any;
  constructor(
    private http: HttpHelperService,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.http.post('Checkout/v1/GetOrderInfoByGuid', { "orderGuid": this.route.snapshot.params.orderGuid, "language": LocalStorageHelper.fetch('language') }).subscribe((resp: any) => {
      this.OrderInfo = resp;
    });
  }
}