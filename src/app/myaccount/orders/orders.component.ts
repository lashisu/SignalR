import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { HttpHelperService } from "../../utils/http-helper.service";
import { TranslateService } from '@ngx-translate/core';
import { CommunicationService } from '../../utils/comm.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
	domain:any = LocalStorageHelper.fetch('domain');
	OrderList:any;	
	NoOrderList:boolean = false;
  constructor(
		private http: HttpHelperService,
		public dialog: MatDialog,
    private communication: CommunicationService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
		this.GetOrderList();
	// POST /api/Activity/v1/OrderItemsInOrder (guid)
	// POST /api/Activity/v1/ReviewQuestions ()
	// =>
	// POST /api/Activity/V1/ReviewFeedback
	// status - pending 1 & 2 (COD - no shw) => Pay
	}

	GetOrderList(){
    this.http.post('Checkout/v3/GetOrderList', { "accountId": LocalStorageHelper.fetch('userId'), "language": LocalStorageHelper.fetch('language'), "noOfRecords": 10000 }).subscribe((resp: any) => {
      if(resp.length == 0){
        this.NoOrderList = true;
      }else{
        this.NoOrderList = false;
      }
      this.OrderList = resp;
    });
	}
	
	TrackOrder(guid){
		let PostData = {
			"someProperty": "",
			"orderGuidList": [guid]
		}
    this.http.post('Activity/v1/TrackOrders', PostData).subscribe((resp: any) => {
      console.log(resp);
    });
	}

	MoveToCart(guid){
		let PostData = {
			"orderGuid": guid,
			"accountId": LocalStorageHelper.fetch('userId'),
			"warehouseId": 0
		}
    this.http.post('Checkout/v1/ReopenOrder', PostData).subscribe((resp: any) => {
			if(resp.isValid){
				this.communication.sendRequest('ShowUserArea');
				this.GetOrderList();
			}else{
				this.Alert('Something went wrong, try after sometime!', 'error');
			}
			console.log(resp);
    });
	}

	GetItemsinOrder(guid){
		let PostData = {
			"orderGuid": guid,
			"language": LocalStorageHelper.fetch('language')
		}
    this.http.post('Checkout/v1/GetItemsinOrder', PostData).subscribe((resp: any) => {
      console.log(resp);
    });
	}

	ShowPay(status, payment_type){
		if(status == '1' || status == '2'){
			if(payment_type == 'COD'){
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	}

	ShowTracking(status){
		return (
			status == 5 ||
			status == 10 ||
			status == 13 ||
			status == 15 ||
			status == 20 ||
			status == 21 ||
			status == 30 ||
			status == 31 ||
			status == 33 ||
			status == 32 ||
			status == 35 ||
			status == 60 ||
			status == 70 ||
			status == 71 ||
			status == 72 ||
			status == 73 ||
			status == 74 ||
			status == 40 ||
			status == 50 ||
			status == 12
		);
	}
	
	PutClass(txt){
		return txt.replace(/\s/g, "");
	}

	Alert(msg, type) {
    this.dialog.open(AlertComponent, {
      width: '400px',
      data : {msg:msg, type:type}
    });
  }
}
