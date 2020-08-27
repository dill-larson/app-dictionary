import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ThesaurusService {
  private apiUrl = "https://words.bighugelabs.com/api/2"
  private key = "e75fe36f1596362791ae487561ac2e07"; //Steves: 3306ed5f2cd255658fab6cb62cccc82e

  constructor(private http: HttpClient) {}

  async getSynonyms(word: string) {
    return await this.http.get(this.buildUrl(word, "json")).toPromise();
  }

  buildUrl(word: string, format: string) {
    return this.apiUrl + "/" + this.key + "/" + word + "/" + format; 
  }
}
