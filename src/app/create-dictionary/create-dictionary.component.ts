import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DictionaryService } from '../services/dictionary.service';
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

  constructor(private router: Router, private dictionaryService: DictionaryService) {
    this.dictionary = {
      name: '',
      owner: this.user,
      view: 0,
      tags: [],
      words: []
    }
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    if(localStorage.getItem("token") != '') {
      this.user.id = localStorage.getItem("token");
    }
    else {
      this.user.id = sessionStorage.getItem("token");
    }
  }

  addDictionary() {
  	if(this.dictionary.name) {
      if(this.user.id != "") {
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
