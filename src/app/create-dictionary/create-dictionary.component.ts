import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DictionaryService } from '../services/dictionary.service';
import { UserService } from '../services/user.service';
import { Dictionary } from '../models/dictionary';
import { User } from '../models/user';
import { Error } from '../models/error';

@Component({
    selector: 'app-create-dictionary',
    templateUrl: './create-dictionary.component.html',
    styleUrls: ['./create-dictionary.component.css']
})
export class CreateDictionaryComponent implements OnInit, OnDestroy {
    
    public dictionary: Dictionary;
    public error: Error;
    public user: User;
    public tags: string;
    private userSubscription: Subscription;

    constructor(private router: Router, private dictionaryService: DictionaryService, public userService: UserService) {
        this.error = {
            code: '',
            message: ''
        };
        this.user = {
            id: '',
            name: '',
            email: ''
        };
        this.dictionary = {
            name: '',
            owner: '',
            users: [],
            published: false,
            size: 0,
            tags: []
        };
    }

    ngOnInit(): void {
        this.userSubscription = this.userService.user$.subscribe(user => {
            this.user = user;
            this.initDictionary();
        });
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }

    initDictionary() {
        this.dictionary.owner = this.user.email;
        this.dictionary.users.push(this.user.email);
    }

    addDictionary() {
        if(this.dictionary.name) {
            if(this.user.email != "") {
                this.separateTags();
                this.dictionaryService.addDictionary(this.dictionary).then(document => {
                    //this.dictionary.id = document.id;
                    this.router.navigate(['/dictionary', document.id]);
                });
            } else {
                this.error.code = "Login Required";
                this.error.message = "You need to be logged in to create a dictionary.";
            }
        } else {
            this.error.code = "Missing Name";
            this.error.message = "Dictionary creation requires a name to be specified.";
        }
    }

    separateTags() {
        if(this.tags == undefined) {
            return;
        }
        this.dictionary.tags = this.tags.split(",");
    }

    closeError() {
        this.error.code = '';
        this.error.message = '';
    }

}
