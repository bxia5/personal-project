import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription} from "rxjs";

import {AuthService} from "../auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription = new Subscription() ;

  constructor(public authService: AuthService, private fb: FormBuilder) {}



  signupForm = new FormGroup({
    email: new FormControl(),
    username: new FormControl(),
    password: new FormControl()
  });
  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    )
    this.signupForm = this.fb.group({
      email: ["Email", [Validators.email, Validators.required]],
      username: ["Username", [Validators.minLength(2), Validators.maxLength(30), Validators.required]],
      password: ["Password", [Validators.minLength(2), Validators.maxLength(10), Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  /*onSignup(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.username, form.value.email, form.value.password);
  }*/

  signUp(){
    this.isLoading = true;
    this.authService.createUser(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password);
  }


}
