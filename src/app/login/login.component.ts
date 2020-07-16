import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceLoader } from '@angular/compiler'; //Why is this here?

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
  public error: Error;
  public rememberMe: boolean;

  constructor(private router: Router, private userService: UserService) {
    this.error = {
      code: '',
      message: ''
    }
    this.user = {
      id: '',
      name: '',
      email: '',
      password: '',
      library: []
    };
  }

  ngOnInit(): void {
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
    return this.user.email != '' && this.user.password != '';
  }

  emailSignin() {
    if(this.validateUserInput()) {
      this.userService.emailSignin(this.user.email, this.user.password)
      .then(() => {
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
    if(this.validateUserInput()) {
      this.userService.googleSignin()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(error => {
        this.error.code = error.code.substring(5).replace(/-/g, " "); //subtring(5) removes auth/
        this.error.message = error.message;
      });
    } else {
      this.error.code = "Invalid Input";
      this.error.message = "Please enter an email and password.";
    }
  }

}
