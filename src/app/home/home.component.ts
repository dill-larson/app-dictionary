import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DictionaryService } from '../services/dictionary.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Dictionary } from '../models/dictionary';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    private userSubscription: Subscription;
    private dictionarySubscrition: Subscription;
    public user: User;
    public dictionaries: Dictionary[];
    public error: Error;
    public length: Array<number> = new Array<number>();

  constructor(private userService: UserService, private dictionaryService: DictionaryService) {
    this.user = {
      id: '',
      name: '',
      email: ''
    };
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.user = user;
      this.getDictionaries(user?.email);
    });
  }

  ngOnDestroy(): void {
    if(this.userSubscription != null) {
      this.userSubscription.unsubscribe();
    }
    // if(this.dictionarySubscrition != null) {
    //   this.dictionarySubscrition.unsubscribe();
    // }
  }

  getDictionaries(userEmail: string) {
    if(userEmail != null) {
      this.dictionaryService.testGetDictionaries(userEmail).then(dictionaries => {
        this.dictionaries = dictionaries;
        //TODO: Find a better solution of displaying cards
        this.length = new Array<number>(Math.ceil(dictionaries.length/4));
        this.length.fill(0); //Used in nested forLoop in displaying cards
      });
    }
  }

}
