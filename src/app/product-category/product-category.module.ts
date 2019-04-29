import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { CategoryComponent } from './category/category.component';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  { path: ":id/:category", component: CategoryComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  declarations: [CategoryComponent],
  imports: [
    SharedModule,
    CountdownTimerModule.forRoot(),
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
})

export class ProductCategoryModule { }