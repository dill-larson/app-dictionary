import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { User } from '../models/user';
import { DictionaryService } from './dictionary.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;
  private userDoc: AngularFirestoreDocument<User>;
  public user$: Observable<User>;
  
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private router: Router, private dictionaryService: DictionaryService) {
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

  async deleteUser() {
    var user = this.afAuth.currentUser;
    return user.then(user => {
      this.deleteUserData(user);
      return user.delete();
    });
  }

  //TODO
  async updateUser(name: string) {
    var user = this.afAuth.currentUser;
    return user.then(user => {
      return user.updateProfile({displayName: name})
        .then(() => {return this.updateUserData(user)});
    });
  }

  //TODO
  async updateUserEmail(email: string) {
    var user = this.afAuth.currentUser;
    return user.then(user => {
      user.updateEmail(email);
      return this.updateUserData(user);
    });
  }

  //TODO
  async updateUserPassword(password: string) {
    var user = this.afAuth.currentUser;
    return (await user).updatePassword(password);
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

  async reauthenticateUser(password: string) {
    var user = this.afAuth.currentUser;
    
    return user.then(user => {
      var credential = auth.EmailAuthProvider.credential(
        user.email,
        password
      );
      return user.reauthenticateWithCredential(credential);
    });
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

  private deleteUserData(user: firebase.User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    this.dictionaryService.deleteDictionaries(user.uid);
    return userRef.delete();
  }

  public getUser(id: string): Observable<User> {
    const path = 'users/' + id;
    this.userDoc = this.afs.doc(path);
    return this.userDoc.valueChanges();
  }
}
