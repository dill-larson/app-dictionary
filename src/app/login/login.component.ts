import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceLoader } from '@angular/compiler'; //Why is this here?

//import { LoginService } from './login.service';
import { User } from '../models/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [  ] //LoginService
})
export class LoginComponent implements OnInit {
  public user : User;

  constructor(private router: Router) { //private loginService: LoginService
    this.user = new User();
  }

  ngOnInit(): void {
  }

  validateLogin() {
    if(this.user.email && this.user.password) {
      //   this.loginService.validateLogin(this.user).subscribe(result => {
      //     console.log('result is ', result);
      //     if(result['status'] === 'success') {
      //       localStorage.setItem("loggedInUser", this.user.email.toString());
      //       this.router.navigate(['']);
      //     } else {
      //       alert('Wrong username or password');
      //     }
      // }, error => {
      //   console.log('error is ', error);
      // });
    } else {
        alert('Enter username and password');
    }
  }
}
