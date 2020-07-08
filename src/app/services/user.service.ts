import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;
  private users: Observable<User[]>;
  private userDoc: AngularFirestoreDocument<User>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection<User>('users');
    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  //TODO: Remove this function
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

  }

  deleteUser(user: User) {
    this.userDoc = this.afs.doc('users/${user.email}');
    this.userDoc.delete();
  }

  async validateLogin(user: User) {
    try {
      const retrievedUser = await this.usersCollection.ref.where('email','==',user.email).where('password','==',user.password).get();
      if(retrievedUser.empty) {
        return new Promise((found, rejection) => {
          found(null);
        });
      }
      return new Promise((found, rejection) => {
        found(retrievedUser.docs[0].id);
      });
    }
    catch(err) {
      console.error(err);
      return new Promise((found, rejection) => {
        found(null);
      });
    }
  }

  getUser(id: string): Observable<User> {
    const path = 'users/' + id;
    this.userDoc = this.afs.doc(path);
    return this.userDoc.valueChanges();
  }
}
