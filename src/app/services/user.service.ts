import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference } from '@angular/fire/firestore';
import { Observable, of ,BehaviorSubject, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { User } from '../models/user';
import { Dictionary } from '../models/dictionary';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user$: Observable<User>;
  private usersCollection: AngularFirestoreCollection<User>;
  private userDoc: AngularFirestoreDocument<User>;
  private user = new BehaviorSubject<User>(null);
  public currentUser = this.user.asObservable();

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          return this.afs.doc<User>(`users/${user.id}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.usersCollection = this.afs.collection<User>('users');
    // this.users = this.usersCollection.snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as User;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   }))
    // );
  }

  // async createUser(email: string, password: string) {
  //   await this.afAuth.createUserWithEmailAndPassword(email, password).catch(function(error) {
  //     console.error(error.code, error.message);
  //   });
  // }

  // async emailSignin(email: string, password: string) {
  //   const provider = new auth.EmailAuthProvider();
  //   const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
  // }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`user/${user.id}`);

    const data = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    return userRef.set(data, { merge: true });
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

  logoutUser() {
    var u = {
      id: '',
      name: '',
      email: '',
      password: '',
      library: []
    };
    this.user.next(u);
  }
}
