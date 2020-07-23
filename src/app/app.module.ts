import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { MatModule } from './mat/mat.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';

import { CustomErrorMessage } from './customModules/CustomErrorMessage';
import {Firebase} from './services/firebase/Firebase';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    DashboardModule,
  ],
  providers: [CustomErrorMessage, Firebase],
  bootstrap: [AppComponent]
})
export class AppModule { }
