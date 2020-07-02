import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//import { SignUpService } from './sign-up.service';
import { User } from '../models/user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [ ] //SignUpService
})
export class SignUpComponent implements OnInit {
  public user : User;
  public confPassword : String;
  
  constructor(private router: Router) { //private signUpService: SignUpService
    this.user = new User();
    this.confPassword = '';
  }

  ngOnInit(): void {
  }

  addUser() {
  	if(this.user.name && this.user.email && this.user.password) {
      // if(this.signUpService.validateEmail(this.user.email)) {
      //   if(this.user.password === this.confPassword) {
      //     this.signUpService.addUser(this.user).subscribe(result =>{
      //       console.log('result is ', result);
      //       if(result['status'] === 'success') {
      //         this.router.navigate(['/login']);
      //       } else {
      //         alert('Unable to add user');
      //       }
      //     });
      //   }
      //   else {
      //     alert('Password mismatch');
      //   }
      // }
      // else {
      //   alert(this.user.email + ' is not a valid email');
      // }
  	} else {
  		alert('Username, Email, and Password are required');
  	}
   }
}
