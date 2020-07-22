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
  private usersCollection: AngularFirestoreCollection<User>;
  private userDoc: AngularFirestoreDocument<User>;
  private user = new BehaviorSubject<User>(null);
  public user$: Observable<User>;
  
  //Get rid of:
  public currentUser = this.user.asObservable();

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
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

  async createUser(name: string, email: string, password: string) {
    const credential: auth.UserCredential = await this.afAuth.createUserWithEmailAndPassword(email, password).catch(error => {
      return error;
    });
    if(credential.user != undefined) {
      return this.createUserData(credential.user, name);
    }
    else {
      return new Promise((resolve, rejected) => 
        rejected(credential)
      );
    }
  }

  async emailSignin(email: string, password: string) {
    const credential: auth.UserCredential = await this.afAuth.signInWithEmailAndPassword(email, password).catch(error => {
      return error;
    });
    if(credential.user != undefined) {
      return this.updateUserData(credential.user);
    }
    else {
      return new Promise((resolve, rejected) => 
        rejected(credential)
      );
    }
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential: auth.UserCredential = await this.afAuth.signInWithPopup(provider).catch(error => {
      return error;
    });
    if(credential.user != undefined) {
      return this.createUserData(credential.user);
    }
    else {
      return new Promise((resolve, rejected) => 
        rejected(credential)
      );
    }
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  private createUserData(user: firebase.User, name?: string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    var displayName: string = name ? name : user.displayName;

    const data: User = {
      id: user.uid,
      name: displayName,
      email: user.email
    };

    return userRef.set(data, { merge: true });
  }

  private updateUserData(user: firebase.User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      id: user.uid,
      email: user.email
    };

    return userRef.set(data, { merge: true });
  }

  //Delete everything below this line -------
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
