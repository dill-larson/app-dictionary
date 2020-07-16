import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit, OnDestroy {
  public searchItem: String;
  public user: User;
  private userSubscription: Subscription;

  constructor(private router: Router, public userService: UserService) {
    this.user = {
      id: '',
      email: ''
    }
  }

  ngOnInit(): void {
    this.searchItem = '';
    this.userSubscription = this.userService.user$.subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  search() {
    this.router.navigate(['/search',this.searchItem]);
  } 
  
  signOut() {
    this.userService.signOut();
  }
}
