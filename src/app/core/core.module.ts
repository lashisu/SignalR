import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { Routes, RouterModule } from "@angular/router";
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MinicartComponent } from './minicart/minicart.component';


const routes: Routes = [
  { path: "", component: NotFoundComponent },
  {
    path: "", component: LayoutComponent, children: [
      { path: "feed", component: HomeComponent },
      { path: "cart", component: MinicartComponent },
      { path: "**", redirectTo: "feed", pathMatch: "full" }
    ],
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  declarations: [LayoutComponent, HomeComponent, MinicartComponent, NotFoundComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CoreModule { }
