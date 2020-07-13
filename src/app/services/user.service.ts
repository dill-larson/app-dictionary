import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { User } from '../models/user';
import { Dictionary } from '../models/dictionary';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;
  private users: Observable<User[]>;
  private userDoc: AngularFirestoreDocument<User>;
  private user = new BehaviorSubject<User>(null);
  public currentUser = this.user.asObservable();

  constructor(private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection<User>('users');
    // this.users = this.usersCollection.snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as User;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   }))
    // );
  }

  // getUsers() {
  //   return this.users;
  // }

  addUser(user: User): boolean {
    try {
      this.usersCollection.add(user)
      return true;
    }
    catch(err) {
      console.error(err);
      return false;
    }
  }

  updateUser(user: User) {
    const path = 'users/' + user.id;
    this.userDoc = this.afs.doc(path);
    this.userDoc.update(user);
  }

  deleteUser(user: User) {
    const path = 'users/' + user.id;
    this.userDoc = this.afs.doc(path);
    this.userDoc.delete();
  }

  validateLogin(user: User): Observable<User> {
    var userSubject = new Subject<User>();

    const retrievedUsers = this.afs.collection('users', ref => ref.where('email', '==', user.email).where('password', '==', user.password))
      .get()
      .pipe(map((item:firebase.firestore.QuerySnapshot) => {
        return item.docs.map((dataItem: firebase.firestore.QueryDocumentSnapshot) => {
          const data = dataItem.data() as User;
          const id = dataItem.id;
          return {id, ...data};
        });
      }));

    retrievedUsers.subscribe(users => {
      if(users.length >= 1) {
        this.user.next(users[0]);
      }
      userSubject.next(users[0]);
    });

    return userSubject.asObservable();
  }

  getUser(id: string): Observable<User> {
    const path = 'users/' + id;
    this.userDoc = this.afs.doc(path);
    const user = this.userDoc.snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data() as User;
        const id = actions.payload.data().id;
        this.user.next({ id, ...data });
        return { id, ...data };
      })
    );
    return user;
  }
}
