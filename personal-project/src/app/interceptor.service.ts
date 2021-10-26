import {Injectable} from "@angular/core";
import {HttpInterceptor} from "@angular/common/http";
import {ProjectResourceService} from "./projectResource/projectResource.service";
import {AuthService} from "./auth/auth.service";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";

@Injectable()
export class HttpInter implements HttpInterceptor{

  constructor(private projectService: ProjectResourceService, private authService: AuthService) {
  }
  intercept(req: any, next: any){
    console.log("sending request", req);
    return next.handle(req).pipe(catchError(err=>{
      //console.error(err);
      //this.authService.obj = null;
      this.projectService.obj = null;
      //this.appService.sub.next(this.appService.obj);
      return of(err);
    }))
  }
}
