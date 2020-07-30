import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DictionaryService } from '../services/dictionary.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';


@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit, OnDestroy {
  public searchItem: String;
  public user: User;
  private userSubscription: Subscription;
  private dictionarySubscription: Subscription;

  constructor(private router: Router, private userService: UserService, private dictionaryService: DictionaryService) {
    this.user = {
      id: '',
      email: '',
      library: []
    }
  }

  ngOnInit(): void {
    this.searchItem = '';
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.user = user;
      this.getUserLibrary(this.user);
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.dictionarySubscription.unsubscribe();
  }

  getUserLibrary(user: User) {
    if(user?.id != null) {
      this.dictionarySubscription = this.dictionaryService.getDictionaries(user.id).subscribe(dictionaries => {
        this.user.library = dictionaries;
      });
    }
  }

  search() {
    this.router.navigate(['/search',this.searchItem]);
  } 
  
  signOut() {
    this.userService.signOut();
  }
}
