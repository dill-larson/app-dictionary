import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { DictionaryService } from '../services/dictionary.service';
import { Dictionary } from '../models/dictionary';
import { Word } from '../models/word';

@Component({
  selector: 'app-show-dictionary',
  templateUrl: './show-dictionary.component.html',
  styleUrls: ['./show-dictionary.component.css']
})
export class ShowDictionaryComponent implements OnInit {
  public dictionary: Dictionary;
  public wordSynonyms: Map<Word, Array<String>>;
  public numOfRows: Map<Word, Array<Number>>
  public addWord: Word;
  public expandedRow: Array<Boolean>;
  public wordsToRemove: Set<Word>;
  public showSynonyms: boolean;
  public dictSize: Number;
  public checkboxArray: Array<Boolean>;
  public check: boolean;
  public error: boolean;
  public functionError: string;
  public wordError: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private dictionaryService: DictionaryService) {
    this.dictionary = {
      id: '',
      name: '',
      owner: null,
      view: null,
      tags: [],
      words: []
    }
    this.addWord = {
      word: '',
      function: ''
    };
    this.wordSynonyms = new Map<Word, Array<String>>();
    this.numOfRows = new Map<Word, Array<Number>>();
    this.expandedRow = new Array<Boolean>().fill(false);
    this.wordsToRemove = new Set<Word>();
    this.checkboxArray = new Array<Boolean>();
    this.showSynonyms = false;
    this.check = false;
    this.error = false;
    this.wordError = '';
    this.functionError = '';
  }

  ngOnInit(): void {
    this.route.params.subscribe(event => {
      this.dictionary.id = event.dict;
     });
    this.getDictionary(this.dictionary.id);
  }

  getDictionary(dictionaryID: string) {
    if(dictionaryID != '') {
      this.dictionaryService.getDictionary(dictionaryID).subscribe(dict => {
        this.dictionary = dict;
      });
      this.dictionaryService.getWords(dictionaryID).subscribe(words => {
        this.dictionary.words = words as Word[];
        this.initCheckboxArray();
        this.initWordSynArrays();
      });
    }
  }

  initWordSynArrays() {
    for(let word of this.dictionary.words) {
      this.wordSynonyms.set(word, new Array<String>());
    }
  }

  hideSynonyms() {
    this.showSynonyms = false;
  }

  getWordSynonyms(word: Word, wordFunc: string) {
    this.http.get(this.buildUrl(word.word, "json"))
      .subscribe((response) => { 
        try {
          this.wordSynonyms.set(word, response[wordFunc]["syn"]);
          this.calculateNumOfRows(word, this.wordSynonyms);
          this.showSynonyms = true;
        }
        catch(TypeError) {
          this.functionError = wordFunc;
          this.wordError = word.word;
          this.error = true;
          this.showSynonyms = false;
          //this.calculateNumOfRows(word, this.wordSynonyms);
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
    for(let word of this.dictionary.words) {
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
    console.log(this.dictionary.id);
    this.dictionaryService.deleteWord(this.dictionary.id, word);

    this.ngOnInit();
  }

  addSyn(word: Word, syn: string) {
    this.addWord.word = syn;
    this.addWord.function = word.function;
    this.dictionaryService.addWord(this.dictionary.id, this.addWord);

    this.ngOnInit();
  }

  closeError() {
    this.wordError = '';
    this.functionError = '';
    this.error = false;
  }

}
