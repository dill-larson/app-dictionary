import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { DictionaryService } from '../services/dictionary.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Dictionary } from '../models/dictionary';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit, OnDestroy {
    public collapsed: boolean = true;
    public searchItem: String;
    public user: User;
    public dictionaries: Dictionary[];
    private userSubscription: Subscription;

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
  }

  getUserLibrary(user: User) {
    if(user?.id != null) {
    //   this.dictionaryService.getDictionaries(user.id).then(dictionaries => {
    //     this.dictionaries = dictionaries;
    //   });
    this.dictionaries = null;
    }
  }

  search() {
    this.router.navigate(['/search',this.searchItem]);
  } 
  
  signOut() {
    this.userService.signOut();
  }
}
