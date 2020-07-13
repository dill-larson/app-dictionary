import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceLoader } from '@angular/compiler'; //Why is this here?

import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user : User;
  public rememberMe: boolean;

  constructor(private router: Router, private userService: UserService) {
    this.user = {
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

  validateUserInput(): boolean {
    return this.user.email != '' && this.user.password != '';
  }

  validateLogin() {
    if(this.validateUserInput()) {
      this.userService.validateLogin(this.user).subscribe(user => {
        if(user != null) {
          this.userService.currentUser.subscribe(user => {
            if(this.rememberMe) {
              localStorage.setItem("loggedInUser", user.email);
              localStorage.setItem("token", user.id); //user ID in database
              console.log("Login component", localStorage.getItem("token"));
            }
            else {
              sessionStorage.setItem("loggedInUser", user.email);
              sessionStorage.setItem("token", user.id); //user ID in database
              console.log("Login component", sessionStorage.getItem("token"));;
            }
            this.router.navigate(['']);
          }).unsubscribe();
        }
        else {
          alert('Invalid username and password combination');
        }
      });
    } else {
        alert('Enter username and password');
    }
  }
}
