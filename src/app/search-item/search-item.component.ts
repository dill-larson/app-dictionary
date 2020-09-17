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
  public dictionaries: Dictionary[];
  private userSubscription: Subscription;

  constructor(private route: ActivatedRoute, private userService: UserService, private dictionaryService: DictionaryService, private thesaurusService: ThesaurusService) {
    this.error = {
      code: '',
      message: ''
    }
    this.user = {
      id: '',
      name: '',
      email: ''
    }
    this.word = {
      word: '',
      function: null
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe(event => {
        this.searchItem = event.key;
        this.getSynonyms(this.searchItem);
    });

    this.getUser();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  getUser() {
    this.userSubscription = this.userService.user$.subscribe(user => { 
      this.user = user;
      this.dictionaryService.getEditableDictionaries(this.user.email).then(dictionaries => {
        this.dictionaries = dictionaries;
      });
    });
    
  }

  getSynonyms(word: string): void {
    //Clear synonyms from previous search requests
    this.nouns = null;
    this.verbs = null;

    //Get synonyms
    this.thesaurusService.getSynonyms(word).then(response => {
      let errorOrigin: string;
      try {
        this.nouns = response["noun"]["syn"];
      } catch (error) {
        if(error instanceof TypeError) {
          //Noun synonyms do not exist
          errorOrigin = "Noun";
          this.error.code = errorOrigin + " Synonyms Not Found";
          this.error.message =  errorOrigin + " synonyms do not exist for this word.";
        } else {
          //All other errors
          this.error.code = "Error";
          this.error.message = error;
        }
      }
      try {
        this.verbs = response["verb"]["syn"];
      } catch (error) {
        if(error instanceof TypeError) {
          //Noun & Verb synonyms do not exist
          if(errorOrigin == "Noun") {
            errorOrigin += " & Verb"
          } else {
            //Verb synonyms do not exist
            errorOrigin = "Verb";
          }
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
    this.word.function = WordFunction[wordFunction];
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
