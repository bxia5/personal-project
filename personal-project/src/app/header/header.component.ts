import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})

export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: Boolean = false;
  username: any = null;
  private authListenerSubs: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.username = this.authService.getUserName();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated
        this.username = this.authService.getUserName();
      });
  }

  onLogout() {
    this.authService.logout();
    this.username = null;
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.username = null;
  }
}
