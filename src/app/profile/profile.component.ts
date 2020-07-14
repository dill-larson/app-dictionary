import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { DictionaryService } from '../services/dictionary.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public userEmail: string;
  public user: User;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private dictionaryService: DictionaryService) {
    this.user = {
      id: '',
      name: '',
      email: '',
      password: '',
      library: []
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(event => {
      this.getUser(event.user);
    });
  }

  getUser(id: string) {
    if(id != '') {
      this.userService.getUser(id).subscribe(user => {
        if(user == null) {
          this.router.navigate(['**']);
        }
        else {
          this.user = user;
        }
      }).unsubscribe();

      this.dictionaryService.getDictionaries(id).subscribe(dictionaries => {
        this.user.library = dictionaries;
      });
    }
  }

}
