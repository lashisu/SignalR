import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  { path: ":auction_id", component: IndexComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  declarations: [IndexComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
})

export class AuctionModule { }