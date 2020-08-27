import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Dictionary } from '../models/dictionary';
import { Error } from '../models/error';

import { DictionaryService } from '../services/dictionary.service';
@Component({
  selector: 'app-search-tag',
  templateUrl: './search-tag.component.html',
  styleUrls: ['./search-tag.component.css']
})
export class SearchTagComponent implements OnInit {
  public tag: string;
  public taggedDictionaries: Dictionary[];
  public error: Error;


  constructor(private route: ActivatedRoute, private dictionaryService: DictionaryService) {
    this.error = {
      message: '',
      code: ''
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe(event => {
      this.tag = event.tag;
      this.getDictionariesByTag(this.tag);
    });
  }

  getDictionariesByTag(tag: string) {
    this.dictionaryService.getDictionariesByTag(tag)
      .then(dictionaries => {
        this.taggedDictionaries = dictionaries; 
      })
      .catch(error => {
        this.error = {
          message: error.message,
          code: error.code
        }
      });
  }

  closeError() {
    this.error = {
      message: '',
      code: ''
    }
  }
}
