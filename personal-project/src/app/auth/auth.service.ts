import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthData, LogData} from "./auth-data.model";
import {environment} from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user/"

@Injectable({providerIn: "root"})
export class AuthService{
  private isAuthenticated = false;
  private token: any = null;
  private tokenTimer: any;
  private userId: any = null;
  private authStatusListener = new Subject<Boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  // For signup form
  createUser(username: string, email: string, password: string){
    const authData: AuthData = {username: username, email: email, password: password};
    this.http.post(BACKEND_URL + "/signup", authData).subscribe(
      () => {
        // Redirect to project page, after singup, Here should be changed!!
        this.router.navigate(["/"]);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  // For login form
  login(username: string, email: string, password: string){
    const logData:LogData = {username: username, password: password};
    this.http.post<{token: string; expiresIn: number; userId: string}>(
      BACKEND_URL + "login",
      logData
    ).subscribe(
      // Response needs token, userId and expiresIn
      response => {
        this.token = response.token;
        if (this.token){
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(this.token, expirationDate, this.userId);
          this.router.navigate(['/']);
          }
      },
      error =>{
        this.authStatusListener.next(false);
      }
    );
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo)
      return;
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

}
