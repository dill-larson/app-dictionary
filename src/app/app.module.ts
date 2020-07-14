import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment.prod';

import { AppRoutingModule } from './routing/routing.service';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { CreateDictionaryComponent } from './create-dictionary/create-dictionary.component';
import { SearchItemComponent } from './search-item/search-item.component';
import { ProfileComponent } from './profile/profile.component';
import { ShowDictionaryComponent } from './show-dictionary/show-dictionary.component';

import { UserService } from './services/user.service';
import { DictionaryService } from './services/dictionary.service';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    TopNavigationComponent,
    SignUpComponent,
    LoginComponent,
    CreateDictionaryComponent,
    SearchItemComponent,
    ProfileComponent,
    ShowDictionaryComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'app-dictionary'),
    AngularFirestoreModule
  ],
  providers: [
    UserService,
    DictionaryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
