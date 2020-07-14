import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DictionaryService } from '../services/dictionary.service';
import { UserService } from '../services/user.service';
import { Dictionary } from '../models/dictionary';
import { User } from '../models/user';
import { Views } from '../models/views.enum';


@Component({
  selector: 'app-create-dictionary',
  templateUrl: './create-dictionary.component.html',
  styleUrls: ['./create-dictionary.component.css']
})
export class CreateDictionaryComponent implements OnInit {
  public dictionary: Dictionary;
  public user: User;

  constructor(private router: Router, private dictionaryService: DictionaryService, private userService: UserService) {
    this.user = {
      id: '',
      name: '',
      email: '',
      password: '',
      library: []
    }
    this.dictionary = {
      name: '',
      owner: this.user.id,
      view: Views.Public,
      tags: []
    }
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService.currentUser.subscribe(user => {
      if(user != null) {
        this.user = user
        this.dictionary.owner = user.id;
      }
    });
    // if(localStorage.getItem("token") != '') {
    //   this.user.id = localStorage.getItem("token");
    // }
    // else {
    //   this.user.id = sessionStorage.getItem("token");
    // }
  }

  addDictionary() {
  	if(this.dictionary.name) {
      if(this.user.id != "") {
        console.log(this.dictionary);
        this.dictionaryService.addDictionary(this.dictionary);
        //this.router.navigate(['/dictionary', this.dict.name]); TODO: How to get dictionary ID (maybe create it myself?)
      }
      else {
        alert('You need to be logged in to create a dictionary')
      }
  	} else {
  		alert('Dictionary name is required');
  	}
  }

}
