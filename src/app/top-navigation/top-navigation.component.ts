import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {
  public user: String;
  public searchItem: String;

  constructor(private router: Router) {
    this.searchItem = '';
  }

  ngOnInit(): void {
    this.user = localStorage.getItem("loggedInUser");
  }

  search() {
    this.router.navigate(['/search',this.searchItem]);
  } 
  
  logout() {
    localStorage.setItem("loggedInUser", '');
    this.ngOnInit();
  }
}
