import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//import { DictionaryService } from './dictionary.service';
import { Dictionary } from '../models/dictionary';
import { User } from '../models/user';
import { Views } from '../models/views.enum';

@Component({
  selector: 'app-create-dictionary',
  templateUrl: './create-dictionary.component.html',
  styleUrls: ['./create-dictionary.component.css']
})
export class CreateDictionaryComponent implements OnInit {
  public dict: Dictionary;
  public user: User;

  constructor(private router: Router) { //private dictService: DictionaryService
    this.dict = new Dictionary();
    this.user = new User();
    this.dict.owner = this.user;
  }

  ngOnInit(): void {
    this.dict.view = Views.Public;
    this.user.email = localStorage.getItem("loggedInUser"); //maybe add function to get pass user from login component
  }

  addDictionary() {
  	if(this.dict.name && this.dict.view) {
      // if(localStorage.getItem("loggedInUser") !== "") {
      //   //Get user from DB
      //   this.user.email = localStorage.getItem("loggedInUser");
      //   this.dictService.addDictionary(this.dict, this.user).subscribe(result =>{
      //     console.log('result is ', result);
      //     if(result['status'] === 'success') {
      //       this.router.navigate(['/dictionary', this.dict.name]);
      //     } else {
      //       alert('Unable to add dictionary to database');
      //     }
      //   });
      // }
      // else {
      //   alert('You need to be logged in to create a dictionary')
      // }
  	} else {
  		alert('Name and View are required');
  	}
  }

}
