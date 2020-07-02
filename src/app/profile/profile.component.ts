import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

//import { UserService } from './user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user: User;
  public retrievedUser: User;
  public library: String[];

  constructor(private route: ActivatedRoute) { //private userService: UserService
    this.user = new User();
    this.retrievedUser = new User();
  }

  ngOnInit(): void {
    this.route.params.subscribe(event => {
      this.user.email = event.user;
     });

     this.getUser(this.user);
  }

  getUser(username: User) {
    if(username) {
    //   this.userService.getUser(username).subscribe(result => {
    //     if(result['status'] === 'success' && result['data'].length >= 1) {
    //       this.retrievedUser = result['data']['0'];
    //       this.library = result['data']['0']['library'];
    //     } else {
    //       alert('Error retreiving '+ username.name);
    //     }
    // }, error => {
    //   console.log('error is ', error);
    // });
    }
  }

}
