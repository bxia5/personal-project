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
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SignupComponent} from "./auth/signup/signup.component";
import {ProjectListComponent} from "./projectResource/project/projectList.component";
import {ProjectComponent} from "./projectResource/project/project.component";
import {ResourceListComponent} from "./projectResource/resource/resourceList.components";
import {ProjectEditComponent} from "./projectResource/project/projectEdit.component";
import {ProjectResourceService} from "./projectResource/projectResource.service";
import {HttpInter} from "./interceptor.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    ProjectListComponent,
    ProjectComponent,
    ProjectEditComponent,
    ResourceListComponent
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
    AuthService,
    ProjectResourceService,
    {
      provide: HTTP_INTERCEPTORS, useClass: HttpInter, multi:true
    }
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
