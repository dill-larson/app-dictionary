import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Error } from '../models/error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: User;
  public password: string;
  public error: Error;
  public rememberMe: boolean;

  constructor(private router: Router, private userService: UserService) {
    this.error = {
      code: '',
      message: ''
    };
    this.user = {
      id: '',
      name: '',
      email: ''
    };
  }

  ngOnInit(): void {
    this.user.email = localStorage.getItem("userEmail");
    this.rememberMe = false;
  }

  toggleRememberMe() {
    this.rememberMe = !this.rememberMe;
  }

  closeError() {
    this.error.code = '';
    this.error.message = '';
  }

  validateUserInput(): boolean {
    return this.user.email != '' && this.password != '';
  }

  emailSignin() {
    if(this.validateUserInput()) {
      this.userService.emailSignin(this.user.email, this.password)
      .then(() => {
        if(this.rememberMe) {
          localStorage.setItem("userEmail", this.user.email);
        } else {
          localStorage.setItem("userEmail", '');
        }
        this.router.navigate(['/']);
      })
      .catch(error => {
        this.error.code = error.code.substring(5).replace(/-/g, " "); //subtring(5) removes auth/
        this.error.message = error.message;
      });
    } else {
      this.error.code = "Invalid Input";
      this.error.message = "Please enter an email and password";
    }
  }

  googleSignin() {
    this.userService.googleSignin()
    .then(() => {
      this.router.navigate(['/']);
    })
    .catch(error => {
      this.error.code = error.code.substring(5).replace(/-/g, " "); //subtring(5) removes auth/
      this.error.message = error.message;
    });
  }

}
