import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

//import { DictionaryService } from './dictionary.service';
import { Dictionary } from '../models/dictionary';
import { Word } from '../models/word';

@Component({
  selector: 'app-show-dictionary',
  templateUrl: './show-dictionary.component.html',
  styleUrls: ['./show-dictionary.component.css']
})
export class ShowDictionaryComponent implements OnInit {
  public dictionary: Dictionary;
  public words: Array<Word>;
  public wordSynonyms: Map<Word, Array<String>>;
  public numOfRows: Map<Word, Array<Number>>
  public addWord: Word;
  public expandedRow: Array<Boolean>;
  public wordsToRemove: Set<Word>;
  public showSynonyms: boolean;
  public dictSize: Number;
  public checkboxArray: Array<Boolean>;
  public check: boolean;

  constructor(private route: ActivatedRoute, private http: HttpClient) { //, private dictService: DictionaryService
    this.dictionary = new Dictionary();
    this.addWord = new Word();
    this.wordSynonyms = new Map<Word, Array<String>>();
    this.numOfRows = new Map<Word, Array<Number>>();
    this.expandedRow = new Array<Boolean>().fill(false);
    this.wordsToRemove = new Set<Word>();
    this.checkboxArray = new Array<Boolean>();
    this.showSynonyms = false;
    this.check = false;
  }

  ngOnInit(): void {
    this.route.params.subscribe(event => {
      this.dictionary.name = event.dict;
     });
    this.getDictionary(this.dictionary.name);
  }

  getDictionary(dict: string) {
    this.dictionary.name = dict;
    if(this.dictionary.name) {
    //   this.dictService.getDictionary(this.dictionary).subscribe(result => {
    //     if(result['status'] === 'success' && result['data'].length >= 1) {
    //       this.words = (result['data']['0']['words']);
    //       this.words.sort((word1, word2) => {
    //         if(word1['word'] > word2['word']) {
    //           return 1;
    //         }
    //         else if(word1['word'] < word2['word']) {
    //           return -1;
    //         }
    //         else {
    //           return 0;
    //         }
            
    //       });
    //       this.dictSize = this.words.length;
    //       this.initWordSynArrays();
    //       this.initCheckboxArray();
    //     } else {
    //       alert('Dictionary ' + this.dictionary.name + ' does not exist.');
    //     }
    // }, error => {
    //   console.log('error is ', error);
    // });
    }
  }

  initWordSynArrays() {
    for(let word of this.words) {
      this.wordSynonyms.set(word, new Array<String>());
    }
  }

  hideSynonyms() {
    this.showSynonyms = false;
  }

  getWordSynonyms(word: Word, wordFunc: string) {
    this.showSynonyms = true;
    this.http.get(this.buildUrl(word.word, "json"))
      .subscribe((response) => { 
        try {
          this.wordSynonyms.set(word, response[wordFunc]["syn"]);
          this.calculateNumOfRows(word, this.wordSynonyms);
        }
        catch(TypeError) {
          this.wordSynonyms.get(word).push("No");
          this.wordSynonyms.get(word).push(wordFunc + " synonyms");
          this.wordSynonyms.get(word).push("exist");
          this.calculateNumOfRows(word, this.wordSynonyms);
        }
      });
  }

  calculateNumOfRows(word: Word, wordSyn: Map<Word, Array<String>>) {
    length = Math.ceil(wordSyn.get(word).slice(3).length/3);
    this.numOfRows.set(word, Array(length).fill(0));
  }

  buildUrl(word: String, format: String) {
    const apiUrl = "http://words.bighugelabs.com/api/2"
    const key = "e75fe36f1596362791ae487561ac2e07"
    return apiUrl + "/" + key + "/" + word + "/" + format; 
  }

  addWordToRemove(word: Word) {
    if(this.wordsToRemove.has(word)) {
      this.wordsToRemove.delete(word);
    }
    else {
      this.wordsToRemove.add(word);
    }
  }

  initCheckboxArray() {
    for(let word of this.words) {
      this.checkboxArray.push(false);
    }
  }

  toggleCheckboxes() {
    for (let i = 0; i < this.checkboxArray.length; i++) {
      this.checkboxArray[i] = this.check;
    }
    console.log(this.checkboxArray);
  }

  removeWords() {
    for(let word of this.wordsToRemove) {
      this.removeWord(word);
    }
  }

  removeWord(word: Word) {
    // this.dictService.removeWord(this.dictionary, word).subscribe(result =>{
    //   if(result['status'] === 'success') {
    //     //alert('Removed ' + word.word + ' from ' + this.dictionary.name);
    //   } else {
    //     alert('Unable to word from ' + this.dictionary.name);
    //   }
    // });

    this.ngOnInit();
  }

  addSyn(word: Word, syn: string) {
    this.addWord.word = syn;
    this.addWord.function = word.function;
    // this.dictService.addWord(this.addWord, this.dictionary).subscribe(result =>{
    //   console.log('result is ', result);
    //   if(result['status'] === 'success') {
    //     //alert('Added word to dictionary ' + this.dictionary.name);
    //   } else {
    //     //alert('Unable to word to dictionary ' + this.dictionary.name);
    //   }
    // });

    this.ngOnInit();
  }

}
