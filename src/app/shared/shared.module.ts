import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ErrorsComponent } from "./errors/errors.component";
import { HttpClientModule } from "@angular/common/http";
import { AlertComponent } from './alert/alert.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { TranslateModule } from '@ngx-translate/core';

import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSliderModule,
  MatSlideToggleModule
} from "@angular/material";

const IMPORT_EXPORT = [
  RouterModule,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  FlexLayoutModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSliderModule,
  MatSlideToggleModule
];

const EXPORTED_COMPONENTS = [ErrorsComponent, AlertComponent, ConfirmComponent];

@NgModule({
  imports: [...IMPORT_EXPORT,
  TranslateModule.forChild()
  ],
  exports: [...IMPORT_EXPORT, ...EXPORTED_COMPONENTS],
  declarations: EXPORTED_COMPONENTS,
  entryComponents: [AlertComponent, ConfirmComponent]
})
export class SharedModule { }
