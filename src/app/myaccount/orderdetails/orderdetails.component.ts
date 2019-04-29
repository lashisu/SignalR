import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { HttpHelperService } from "../../utils/http-helper.service";
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.scss']
})
export class OrderdetailsComponent implements OnInit {
  ItemsinOrder:any;
  NoItemsInOrder:boolean = false;
  constructor(
		private http: HttpHelperService,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.http.post('Checkout/v1/GetItemsinOrder', {"orderGuid": this.route.snapshot.params.orderGuid, "language": LocalStorageHelper.fetch('language')}).subscribe((resp:any)=>{
      this.ItemsinOrder = resp;
      if(resp.basketInfo.length > 0){
        this.NoItemsInOrder = false;
      }else{
        this.NoItemsInOrder = true;
      }
    });
  }
}
