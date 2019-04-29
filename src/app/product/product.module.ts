import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { IndexComponent } from './index/index.component';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { TranslateModule } from '@ngx-translate/core';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';

const routes: Routes = [
  { path: ":product_id", component: IndexComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  declarations: [IndexComponent],
  imports: [
    SharedModule,
    CountdownTimerModule.forRoot(),
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    VgCoreModule,
    VgControlsModule,
  ],
})
export class ProductModule { }
