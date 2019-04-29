import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { TranslateModule } from '@ngx-translate/core';
import { CartComponent } from './cart/cart.component';
import { MyauctionsComponent } from './myauctions/myauctions.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { TrackorderComponent } from './trackorder/trackorder.component';
import { OrderdetailsComponent } from './orderdetails/orderdetails.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CountdownTimerModule } from 'ngx-countdown-timer';

const routes: Routes = [
  { path: "cart", component: CartComponent },
  { path: "myauctions", component: MyauctionsComponent },
  { path: "profile", component: ProfileComponent },
  { path: "orders", component: OrdersComponent },
  { path: "trackorders/:orderGuid", component: TrackorderComponent },
  { path: "orderdetails/:orderGuid", component: OrderdetailsComponent },
  { path: "invoice/:orderGuid", component: InvoiceComponent },
  { path: "**", redirectTo: "profile", pathMatch: "full" }
];

@NgModule({
  declarations: [CartComponent, MyauctionsComponent, ProfileComponent, OrdersComponent, TrackorderComponent, OrderdetailsComponent, InvoiceComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    CountdownTimerModule.forRoot(),
    TranslateModule.forChild()
  ]
})
export class MyaccountModule { }
