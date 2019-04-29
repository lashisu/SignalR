import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { HttpHelperService } from "../../utils/http-helper.service";
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-trackorder',
  templateUrl: './trackorder.component.html',
  styleUrls: ['./trackorder.component.scss']
})
export class TrackorderComponent implements OnInit {

  NoDetails:boolean = false;
  constructor(
		private http: HttpHelperService,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) { }


    // POST /api/Activity/v1/OrderItemsInOrder (guid)
    
  ngOnInit() {
    //let OrderGuid = this.route.snapshot;
    console.log(this.route.snapshot.params.orderGuid);
  }

}