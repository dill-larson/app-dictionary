import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { DictionaryService } from '../services/dictionary.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Error } from '../models/error';
import { Dictionary } from '../models/dictionary';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user: User;
  public password: string;
  public updateU: User;
  public newPassword: string;
  public confPassword: string;
  public dictionaries: Dictionary[];
  private userSubscription: Subscription;
  public error: Error;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private dictionaryService: DictionaryService, private modalService: NgbModal) {
    this.user = {
      id: '',
      name: '',
      email: ''
    };
    this.updateU = {
      id: '',
      name: '',
      email: ''
    };
    this.error = {
      code: '',
      message: ''
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe(event => {
      this.getUser(event.user);
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  open(content) {
    if(this.password) {
      this.userService.reauthenticateUser(this.password)
      .then(() => {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          if(result = "delete") {
            this.deleteUser();
          }
        });
      })
      .catch(error => {
        this.error.code = error.code.substring(5).replace(/-/g, " "); //subtring(5) removes auth/
        this.error.message = error.message;
      });
    } else {
      this.error.code = "Invalid Password";
      this.error.message = "Old password is needed to delete user profile."
    }
  }

  closeError() {
    this.error.code = '';
    this.error.message = '';
  }

  closeAlert() {
    //TODO
  }

  getUser(id: string) {
    if(id != '') {
      this.userSubscription = this.userService.getUser(id).subscribe(user => {
        if(user == null) {
          this.router.navigate(['**']);
        } else {
          this.user = user;
          this.updateU = {
            ...this.user
          };
          this.dictionaryService.testGetDictionaries(this.user.email).then(dictionaries => {
            this.dictionaries = dictionaries;
          });
        }
      });
    }
  }

  deleteUser() {
    this.userService.deleteUser()
      .then(() =>
        this.router.navigate(['/'])
      )
      .catch(error => {
        this.error.code = error.code;
        this.error.message = error.message;
      });
  }

  updateUser() {
    if(this.password) {
      this.userService.reauthenticateUser(this.password)
        .then(() => {
          if(this.updateU.name != this.user.name) {
            console.log("Updating name...");
            this.userService.updateUser(this.updateU.name)
              .catch(error => {
                this.error.code = error.code;
                this.error.message = error.message;
              });
          }
          if(this.updateU.email != this.user.email) {
            console.log("Updating email...");
            this.userService.updateUserEmail(this.updateU.email)
              .catch(error => {
                this.error.code = error.code;
                this.error.message = error.message;
              });
          }
          if(this.newPassword) {
            if(this.newPassword == this.confPassword) {
              this.userService.updateUserPassword(this.updateU.email)
              .catch(error => {
                this.error.code = error.code;
                this.error.message = error.message;
              });
            } else {
              this.error.code = "Password Mistach";
              this.error.message = "New password and confirm password do not match."
            }
          }

          //Clear any passwords
          this.newPassword = "";
          this.confPassword = "";
          this.password = "";
        })
        .catch(error => {
          this.error.code = error.code.substring(5).replace(/-/g, " "); //subtring(5) removes auth/
          this.error.message = error.message;
        });
    } else {
      this.error.code = "Invalid Password";
      this.error.message = "Old password is needed to update user profile."
    }
  }

}
