import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { FormsModule } from '@angular/forms';
import {  HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LocationInputComponent } from './home/location-input/location-input.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import {  ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { PageNOtFoundComponent } from './page-not-found/page-not-found.component';
import { RouteDetailsComponent } from './home/route-details/route-details.component';
import { RidesComponent } from './home/rides/rides.component';
import { RideDetailsComponent } from './home/ride-details/ride-details.component';



@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ProfileComponent,
    HeaderComponent,
    HomeComponent,
    LocationInputComponent,
    VehiclesComponent,
    ResetPasswordComponent,
    PageNOtFoundComponent,
    RouteDetailsComponent,
    RidesComponent,
    RideDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
