import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./auth/auth.guard";
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {ProjectListComponent} from "./projectResource/project/projectList.component";
import {ProjectComponent} from "./projectResource/project/project.component";
import {ResourceListComponent} from "./projectResource/resource/resourceList.components";

const routes: Routes = [
  {path: "", component: ResourceListComponent, canActivate:[AuthGuard]},
  {path: "projectList", component: ProjectListComponent, canActivate:[AuthGuard]},
  {path: "project", component: ProjectComponent, canActivate:[AuthGuard]},
  {path: "auth/login", component:LoginComponent},
  {path: "auth/signup", component:SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
