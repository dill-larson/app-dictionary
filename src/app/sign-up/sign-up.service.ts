import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { User } from '../models/user.model';

@Injectable()
export class SignUpService {

  constructor(private http: HttpClient) { }

  // addUser(user : User) {
	// 	return this.http.post('/api/user/create',{
	// 		name : user.name,
  //           email : user.email,
  //           password : user.password
	// 	})
	// }

	validateEmail(email: String): boolean {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(String(email).toLowerCase());
	}
}
