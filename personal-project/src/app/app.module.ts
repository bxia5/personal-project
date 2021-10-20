import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HeaderComponent} from "./header/header.component";
import {AngularMaterialModule} from "./angular-material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {LoginComponent} from "./auth/login/login.component";
import {AuthService} from "./auth/auth.service";
import { HttpClientModule} from "@angular/common/http";
import {SignupComponent} from "./auth/signup/signup.component";
import {ProjectListComponent} from "./projectResource/project/projectList.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    ProjectListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginComponent,
    SignupComponent
  ]
})
export class AppModule {

}
