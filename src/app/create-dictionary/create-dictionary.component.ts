import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DictionaryService } from '../services/dictionary.service';
import { UserService } from '../services/user.service';
import { Dictionary } from '../models/dictionary';
import { User } from '../models/user';
import { Error } from '../models/error';
import { Views } from '../models/views.enum';

@Component({
  selector: 'app-create-dictionary',
  templateUrl: './create-dictionary.component.html',
  styleUrls: ['./create-dictionary.component.css']
})
export class CreateDictionaryComponent implements OnInit, OnDestroy {
  public dictionary: Dictionary;
  public error: Error;
  public user: User;
  private userSubscription: Subscription;

  constructor(private router: Router, private dictionaryService: DictionaryService, public userService: UserService) {
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
    this.dictionary = {
      name: '',
      owner: this.user.id,
      view: Views.Public,
      tags: []
    };
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.user = user
      this.dictionary.owner = user.id;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  addDictionary() {
  	if(this.dictionary.name) {
      if(this.user.id != "") {
        this.dictionaryService.addDictionary(this.dictionary).then(document => {
          this.dictionary.id = document.id
          this.router.navigate(['/dictionary', this.dictionary.id]);
        });
      }
  	} else {
      this.error.code = "Missing Name";
      this.error.message = "Dictionary creation requires a name to be specified.";
  	}
  }

  closeError() {
    this.error.code = '';
    this.error.message = '';
  }

}
