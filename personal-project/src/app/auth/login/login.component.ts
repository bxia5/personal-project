import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";
import {FormBuilder, Validators, FormGroup, FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSub: Subscription = new Subscription();
  constructor(public authService: AuthService, private fb:FormBuilder, private route:ActivatedRoute, private router:Router) { }

  logForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });
  ngOnInit(): void {

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.logForm = this.fb.group({
      username: ["Username", [Validators.minLength(2), Validators.maxLength(30), Validators.required]],
      password: ["Password", [Validators.minLength(2), Validators.maxLength(10), Validators.required]]
    });
  }

  logIn(){
    //console.log(this.logForm);
    this.isLoading = true;
    this.authService.login(this.logForm.value.username, this.logForm.value.password);
  }
  /*onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.username, form.value.password);
  }*/

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  goToSignup(){
    this.router.navigate(['/auth/signup'])
  }

}
