import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { DictionaryService } from '../services/dictionary.service';
import { Dictionary } from '../models/dictionary';
import { Word } from '../models/word';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-show-dictionary',
  templateUrl: './show-dictionary.component.html',
  styleUrls: ['./show-dictionary.component.css']
})
export class ShowDictionaryComponent implements OnInit {
  public user: User;
  public dictionary: Dictionary;
  public words: Word[];
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
  private dictionarySubscription: Subscription;
  private wordSubscription: Subscription;
  public tags: Set<string>;
  public tagsToBeAdded: string;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private dictionaryService: DictionaryService, public userService: UserService, private modalService: NgbModal) {
    this.dictionary = {
      id: '',
      name: '',
      owner: null,
      view: null,
      tags: [],
      size: 0,
      words: []
    }
    this.addWord = {
      word: '',
      function: ''
    };
    this.wordSynonyms = new Map<Word, Array<String>>();
    this.numOfRows = new Map<Word, Array<Number>>();
    this.expandedRow = new Array<Boolean>();
    this.wordsToRemove = new Set<Word>();
    this.checkboxArray = new Array<Boolean>();
    this.showSynonyms = false;
    this.check = false;
    this.error = false;
    this.wordError = '';
    this.functionError = '';
  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
    this.route.params.subscribe(event => {
      this.dictionary.id = event.dict;
      this.getDictionary(this.dictionary.id);
    });
  }

  ngOnDestroy(): void {
    this.dictionarySubscription.unsubscribe();
    this.wordSubscription.unsubscribe();
  }

  canRead(): boolean {
    if(this.user != null) {
      return this.dictionary.owner == this.user.id || this.dictionary.editor.includes(this.user.id) || this.dictionary.viewer.includes(this.user.id);
    }
    else {
      return false;
    }
  }

  canEdit(): boolean {
    if(this.user != null) {
      return this.dictionary.owner == this.user.id || this.dictionary.editor.includes(this.user.id);
    }
    else {
      return false;
    }
  }

  canDelete(): boolean {
    if(this.user != null) {
      return this.dictionary.owner == this.user.id;
    }
    else {
      return false;
    }
  }

  getDictionary(dictionaryID: string) {
    if(dictionaryID != '') {
      this.dictionarySubscription = this.dictionaryService.getDictionary(dictionaryID).subscribe(dict => {
        this.dictionary = dict;
        this.tags = new Set(dict.tags);
      });
      this.wordSubscription = this.dictionaryService.getWords(dictionaryID).subscribe(words => {
        this.words = words as Word[];
        this.initCheckboxArray();
        this.initWordSynArrays();
      });
    }
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(result == "delete") {
        this.deleteDictionary();
      }
      else if(result == "save") {
        if(this.tagsToBeAdded?.length > 0) {
          this.addTags(this.tagsToBeAdded);
        }
        this.updateTags();
      }
    });
  }

  initWordSynArrays() {
    for(let word of this.words) {
      this.wordSynonyms.set(word, new Array<String>());
    }
  }

  expandRow(index: number) {
    this.expandedRow[index] = !this.expandedRow[index];
  }

  hideSynonyms() {
    for(let index = 0; index < this.expandedRow.length; ++index) {
      this.expandedRow[index] = false;
    }
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
    const apiUrl = "https://words.bighugelabs.com/api/2"
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
      this.expandedRow.push(false);
    }
  }

  toggleCheckboxes() {
    for (let i = 0; i < this.checkboxArray.length; i++) {
      this.checkboxArray[i] = this.check;
    }
  }

  removeWords() {
    for(let word of this.wordsToRemove) {
      this.removeWord(word);
    }
    //this.ngOnDestroy();
    this.ngOnInit();
  }

  removeWord(word: Word) {
    this.dictionaryService.deleteWord(this.dictionary.id, word);
  }

  addSyn(word: Word, syn: string) {
    this.addWord.word = syn;
    this.addWord.function = word.function;
    this.dictionaryService.addWord(this.dictionary.id, this.addWord);
    this.showSynonyms = false;

    this.ngOnInit();
  }

  closeError() {
    this.wordError = '';
    this.functionError = '';
    this.error = false;
  }

  deleteDictionary() {
    this.dictionaryService.deleteDictionary(this.dictionary.id)
      .then(() => this.router.navigate(['/']))
      .catch(error => console.error(error));
  }

  deleteTag(tag: string) {
    this.tags.delete(tag);
  }

  updateTags() {
    this.dictionaryService.updateTags(this.dictionary.id, Array.from(this.tags));
  }

  addTags(tags: string) {
    for(let tag of tags.split(",")) {
      this.tags.add(tag);
    }
  }

}
