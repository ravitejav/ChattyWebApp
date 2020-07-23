import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {A11yModule} from '@angular/cdk/a11y';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    A11yModule
  ],
  exports: [
    A11yModule,
  ]
})
export class CdkModule { }
