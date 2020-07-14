import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Dictionary } from '../models/dictionary';
import { Word } from '../models/word';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private dictionaryCollection: AngularFirestoreCollection<Dictionary>;
  //private dictionaries: Observable<Dictionary[]>;
  private dictionaryDoc: AngularFirestoreDocument<Dictionary>;
  private wordDoc: AngularFirestoreDocument<Word>;

  constructor(private afs: AngularFirestore) {
    this.dictionaryCollection = this.afs.collection<Dictionary>('dictionaries');
    // this.dictionaries = this.dictionaryCollection.snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as Dictionary;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   }))
    // );
  }

  addDictionary(dictionary: Dictionary) {
    this.dictionaryCollection.add(dictionary);
  }

  deleteDictionary(dictionaryID: string) {
    const path = 'dictionaries/' + dictionaryID;
    this.dictionaryDoc = this.afs.doc(path);
    this.dictionaryDoc.delete(); //TODO: delete subcollection 'words'
  }

  getDictionaries(userID: string): Observable<Dictionary[]> {
    return this.afs.collection('dictionaries', ref => ref.where('owner', '==', userID)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Dictionary;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getDictionary(dictionaryID: string): Observable<Dictionary> {
    const path = 'dictionaries/' + dictionaryID;
    this.dictionaryDoc = this.afs.doc(path);
    const dictionary = this.dictionaryDoc.snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data() as Dictionary;
        const id = dictionaryID;
        return { id, ...data };
      })
    );
    
    return dictionary;
  }

  addWord(dictionaryID: string, word: Word) {
    const path = 'dictionaries/' + dictionaryID;
    this.afs.doc(path).collection('words').doc(word.word).set({
      word: word.word,
      function: word.function
    });
  }

  getWords(dictionaryID: string) { //: Observable<Word[]>
    const path = 'dictionaries/' + dictionaryID;
    this.dictionaryDoc = this.afs.doc(path);
    const words = this.dictionaryDoc.collection('words', ref => ref.orderBy('word', 'asc')).valueChanges();

    return words;
  }

  deleteWord(dictionaryID: string, word: Word) {
    const path = 'dictionaries/' + dictionaryID + '/words/' + word.word;
    this.wordDoc = this.afs.doc(path);
    this.wordDoc.delete();
  }
}
