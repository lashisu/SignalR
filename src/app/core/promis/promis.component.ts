import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { CommunicationService } from '../../utils/comm.service';
import { getCountry } from 'src/app/utils/data.util';

@Component({
  selector: 'app-promis',
  templateUrl: './promis.component.html',
  styleUrls: ['./promis.component.scss']
})
export class PromisComponent implements OnInit {

  currencyCode: any;
  deliveryPriceInUserCurrency: any;
  minBidInUserCurrency: any;
  chilindoContactNumberPrefix: any;
  chilindoContactNumber: any;
  getRequest$;

  constructor(public translate: TranslateService, private communication: CommunicationService) { }

  ngOnInit() {
    this.SetData();
    this.getRequest$ = this.communication.getRequest().subscribe((req) => {
      if (req == 'ShowUserArea') {
        this.SetData();
      }
    });
  }

  SetData() {
    this.currencyCode = LocalStorageHelper.fetch('currencyCode');
    this.deliveryPriceInUserCurrency = LocalStorageHelper.fetch('deliveryPriceInUserCurrency');
    this.minBidInUserCurrency = LocalStorageHelper.fetch('minBidInUserCurrency');
    this.chilindoContactNumberPrefix = LocalStorageHelper.fetch('chilindoContactNumberPrefix');
    this.chilindoContactNumber = LocalStorageHelper.fetch('chilindoContactNumber');

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
  ngOnDestroy(): void {
    this.getRequest$.unsubscribe();
  }
}