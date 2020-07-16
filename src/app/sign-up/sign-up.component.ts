import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { User } from '../models/user';


export interface Error {
  code: string,
  message: string,
}
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public user : User;
  public confPassword : string;
  public error: Error;

  constructor(private router: Router, private userService: UserService) {
    this.error = {
      code: '',
      message: ''
    };
    this.user = {
      id: '',
      name: '',
	    email: '',
	    password: '',
      library: []
    };
  }

  ngOnInit(): void {
    this.confPassword = '';
  }

  closeError() {
    this.error.code = '';
    this.error.message = '';
  }

  validateUserInput(): boolean {
    return this.user.name != '' && this.user.email != '' && this.user.password != '';
  }

  createUser() {
    if(this.validateUserInput()) {
      if(this.user.password == this.confPassword) {
        this.userService.createUser(this.user.name, this.user.email, this.user.password)
        .then(() => {
          this.router.navigate(['login']);
        })
        .catch(error => {
          this.error.code = error.code.substring(5).replace(/-/g, " "); //subtring(5) removes auth/
          this.error.message = error.message;
        });
      } else {
        this.error.code = "Password Mismatch";
        this.error.message = "Password and confirm password did not match."
      }
    }
  }
  
}
