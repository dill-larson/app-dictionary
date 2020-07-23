import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Word } from '../models/word';
import { WordFunction } from '../models/word-function.enum';
import { Dictionary } from '../models/dictionary';
import { User } from '../models/user';
import { Error } from '../models/error';

import { UserService } from '../services/user.service';
import { DictionaryService } from '../services/dictionary.service';
import { ThesaurusService } from '../services/thesaurus.service';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent implements OnInit, OnDestroy {
  public user: User;
  public searchItem: string;
  public nouns: string[];
  public verbs: string[];
  //public arrayOfDict: Dictionary[]; TODO add ability to search for dictionaries by name

  public error: Error;
  public word: Word;
  public dictionary: Dictionary;
  private userSubscription: Subscription;

  constructor(private route: ActivatedRoute, private userService: UserService, private dictionaryService: DictionaryService, private thesaurusService: ThesaurusService) {
    this.error = {
      code: '',
      message: ''
    }
    this.user = {
      id: '',
      name: '',
      email: '',
      library: []
    }
    this.word = {
      word: '',
      function: ''
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe(event => {
        this.searchItem = event.key;
    });

    this.getUser();
    this.getSynonyms(this.searchItem);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  getUser() {
    this.userSubscription = this.userService.user$.subscribe(user => { 
      this.user = user;
      this.dictionaryService.getDictionaries(this.user.id).subscribe(dictionaries => {
        console.log(dictionaries);
        this.user.library = dictionaries;
      });
    });
    
  }

  getSynonyms(word: string): void {
    this.thesaurusService.getSynonyms(word).then(response => {
      let errorOrigin: string;
      try {
        errorOrigin = "Noun";
        this.nouns = response["noun"]["syn"];
        errorOrigin = "Verb";
        this.verbs = response["verb"]["syn"];
      } catch (error) {
        if(error instanceof TypeError) {
          //Noun or Verb synonyms do not exist
          this.error.code = errorOrigin + " Synonyms Not Found";
          this.error.message =  errorOrigin + " synonyms do not exist for this word.";
        } else {
          //All other errors
          this.error.code = "Error";
          this.error.message = error;
        }
      }
    })
    .catch(error => {
      //Server-side errors
      this.error.code = error.substring(0,14); //error code for server-side errors
      this.error.message = error.substring(15); 
    });
  }

  addWord(word: string, wordFunction: string, dictionaryID: string) {
    this.word.word = word;
    this.word.function = wordFunction;
    this.dictionaryService.addWord(dictionaryID, this.word);
  }

  closeError() {
    this.error.code = '';
    this.error.message = '';
  }

  //TODO add ability to search dictionaries by name
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
