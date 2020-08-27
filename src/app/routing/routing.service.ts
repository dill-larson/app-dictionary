import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { LoginComponent } from '../login/login.component';
import { CreateDictionaryComponent } from '../create-dictionary/create-dictionary.component';
import { SearchItemComponent } from '../search-item/search-item.component';
import { ProfileComponent } from '../profile/profile.component';
import { ShowDictionaryComponent } from '../show-dictionary/show-dictionary.component';
import { SearchTagComponent } from '../search-tag/search-tag.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-dictionary', component: CreateDictionaryComponent },
  { path: 'search/:key', component: SearchItemComponent },
  { path: 'tag/:tag', component: SearchTagComponent },
  { path: 'profile/:user', component: ProfileComponent },
  { path: 'dictionary/:dict', component: ShowDictionaryComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }