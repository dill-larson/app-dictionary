import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {
  public user: User;
  public searchItem: String;

  constructor(private router: Router, private userService: UserService) {
    this.user = {
      id: '',
      name: '',
      email: '',
      password: '',
      library: []
    }
  }

  ngOnInit(): void {
    this.searchItem = '';
    this.getUser();
  }

  getUser() {
    this.userService.currentUser.subscribe(user => {
      if(user != null) {
        this.user = user;
      }
    });
    if(localStorage.getItem("loggedInUser") != '') {
      this.user.email = localStorage.getItem("loggedInUser");
      this.user.id = localStorage.getItem("token");
    }
    else {
      this.user.email = sessionStorage.getItem("loggedInUser");
      this.user.id = sessionStorage.getItem("token");
    }
  }

  search() {
    this.router.navigate(['/search',this.searchItem]);
  } 
  
  logout() {
    localStorage.setItem("loggedInUser", '');
    sessionStorage.setItem("loggedInUser", '');
    this.ngOnInit();
  }
}
