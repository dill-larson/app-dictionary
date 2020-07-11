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
        const id = actions.payload.data().id;
        return { id, ...data };
      })
    );
    
    return dictionary;
  }

  getWords(dictionaryID: string) { //: Observable<Word[]>
    const path = 'dictionaries/' + dictionaryID;
    this.dictionaryDoc = this.afs.doc(path);
    const words = this.dictionaryDoc.collection('words', ref => ref.orderBy('word', 'asc')).valueChanges();

    return words;
  }
}
