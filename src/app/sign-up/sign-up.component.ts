import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public user : User;
  public confPassword : string;
  
  constructor(private router: Router, private userService: UserService) {
    this.user = {
      name: '',
	    email: '',
	    password: ''
    };
  }

  ngOnInit(): void {
    this.confPassword = '';
  }

  validateUserInput(): boolean {
    return this.user.name != '' && this.user.email != '' && this.user.password != '';
  }

  validateEmail(email: String): boolean {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(String(email).toLowerCase());
  }
  
  addUser() {
  	if(this.validateUserInput()) {
      if(this.validateEmail(this.user.email)) {
        if(this.user.password == this.confPassword) {
          if(this.userService.addUser(this.user)) { //
            this.router.navigate(['/login']);
          }
          else {
            alert('Unable to add user');
          }
        }
        else {
          alert('Password mismatch');
        }
      }
      else {
        alert(this.user.email + ' is not a valid email');
      }
  	} else {
  		alert('Username, Email, and Password are required');
  	}
   }
}
