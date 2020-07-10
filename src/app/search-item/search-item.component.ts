import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//import { DictionaryService } from './dictionary.service';
//import { UserService } from './user.service';
//import { SynonymService } from '../search-item/synonym.service';
import { Word } from '../models/word';
import { WordFunction } from '../models/word-function.enum';
import { Dictionary } from '../models/dictionary';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css'],
  providers: [  ] //DictionaryService, UserService
})
export class SearchItemComponent implements OnInit {

  public user: User;
  public searchItem: string;
  public library: String[];
  public nouns: String[];
  public verbs: String[];
  public arrayOfDict: Dictionary[];

  public word: Word;
  public dictionary: Dictionary;

  constructor(private route: ActivatedRoute, private http: HttpClient) { //, private dictService: DictionaryService, private userService: UserService
    this.word = new Word();
    //this.dictionary = new Dictionary();
    //this.user = new User();
  }

  ngOnInit(): void {
    this.route.params.subscribe(event => {
        this.searchItem = event.key;
    });

    this.user.email = localStorage.getItem("loggedInUser");
    this.getUser(this.user);
    this.getSynonyms(this.searchItem);
    this.getDictionary(this.searchItem);
  }

  getUser(username: User) {
    if(username) {
      // this.userService.getUser(username).subscribe(result => {
      //   if(result['status'] === 'success' && result['data'].length >= 1) {
      //     this.library = result['data']['0']['library'];
      //   } else {
      //     alert('You are not logged in');
      //   }
      // }, error => {
      //   console.log('error is ', error);
      // });
    }
  }

  getSynonyms(word: String) {
    return this.http.get(this.buildUrl(word, "json"))
        .subscribe((response) => { 
            this.nouns = response['noun']['syn'];
            this.verbs = response['verb']['syn'];
        });
  }

  buildUrl(word: String, format: String) {
    const apiUrl = "https://words.bighugelabs.com/api/2"
    const key = "e75fe36f1596362791ae487561ac2e07" //Steves: 3306ed5f2cd255658fab6cb62cccc82e
    return apiUrl + "/" + key + "/" + word + "/" + format; 
  }

  addWord(word: string, wordFunction: WordFunction, dict: string) {
    this.word.word = word;
    this.word.function = wordFunction;
    this.dictionary.name = dict;
    // this.dictService.addWord(this.word, this.dictionary).subscribe(result =>{
    //   console.log('result is ', result);
    //   if(result['status'] === 'success') {
    //     alert('Added word to dictionary ' + this.dictionary.name);
    //   } else {
    //     alert('Unable to word to dictionary ' + this.dictionary.name);
    //   }
    // });
  }

  getDictionary(dict: String) {
    // this.dictionary.name = dict;
    // if(this.dictionary.name) {
    //   this.dictService.getDictionary(this.dictionary).subscribe(result => {
    //     console.log('result is ', result);
    //     if(result['status'] === 'success' && result['data'].length >= 1) {
    //       this.arrayOfDict = (result['data']);
    //     } else {
    //       //alert('Dictionary ' + this.dictionary.name + ' does not exist.');
    //     }
    // }, error => {
    //   console.log('error is ', error);
    // });
    // }
  }
}
