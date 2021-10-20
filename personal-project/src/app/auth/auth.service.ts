import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthData, LogData} from "./auth-data.model";
import {environment} from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user/"

@Injectable({providedIn: "root"})
export class AuthService{
  private isAuthenticated = false;
  //private token: any = null;
  //private tokenTimer: any;
  obj: any;
  private userId: any = null;
  private username: any = null;
  private password: any = null;
  private authStatusListener = new Subject<Boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  /*getToken(){
    return this.token;
  }*/

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }
  getUserName(){
    return this.username;
  }


  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  private saveAuthData(username: string, /*expirationDate: Date,*/ userId: string) {
    localStorage.setItem("username", username);
    //localStorage.setItem("password", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("username");
    //localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  logout() {
    this.username = null;
    this.password = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    //clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  /*private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }*/

  transRequest(data: AuthData){
    return "username="+data.username+"&email="+data.email+"&password="+data.password;
  }

  // For signup form
  createUser(username: string, email: string, password: string){
    //const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    const authData: AuthData = {username: username, email: email, password: password};
    //console.log(authData);
    this.http.request('Post',BACKEND_URL + "createUser" + "?" + this.transRequest(authData)).subscribe(
      (res) => {
        // Redirect to project page, after singup, Here should be changed!!
        //console.log(res);
        this.obj = res;
        if (this.obj) {
          this.isAuthenticated = true;
          this.saveAuthData(this.obj.username, this.obj.password);
          this.userId = this.obj.id;
          this.username = this.obj.username;
          this.password = this.obj.password;
          //console.log(this.userId);
          this.authStatusListener.next(true);
        }
        this.router.navigate(["/"]);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  transLogRequest(data: LogData){
    return "username="+data.username+"&password="+data.password;
  }
  // For login form
  login(username: string, password: string){
    const logData:LogData = {username: username, password: password};
    this.http.request/*<{token: string; expiresIn: number; userId: string}>*/(
      'POST',
      BACKEND_URL + "login" + "?" + this.transLogRequest(logData)).subscribe(
      // Response needs token, userId and expiresIn
      (res)=> {
        //console.log(res);
        this.obj = res;
        if (this.obj) {
          this.isAuthenticated = true;
          this.saveAuthData(this.obj.username, this.obj.password);
          this.userId = this.obj.id;
          this.username = this.obj.username;
          this.password = this.obj.password;
          //console.log(this.userId);
          this.authStatusListener.next(true);
        }
        /*this.token = response.token;
        if (this.token){
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(this.token, expirationDate, this.userId);*/
          this.router.navigate(['/']);
          //}
      },
      error =>{
        this.authStatusListener.next(false);
      }
    );
  }

  private getAuthData(){
    const token = localStorage.getItem('username');
    //const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (this.username == null){
      return;
    }
    return {
      username: this.username,
      //expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo)
      return;
    /*const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){*/
      this.username = authInfo.username;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      //this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    //}
  }

}
