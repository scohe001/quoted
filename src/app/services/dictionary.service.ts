import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DictionaryResponse } from '../interfaces/dictionaryResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private http: HttpClient,) { }

  public async LookupWord(word: string): Promise<Array<DictionaryResponse>> {
    return await this.http.get<Array<DictionaryResponse>>('https://api.dictionaryapi.dev/api/v2/entries/en/' + word).toPromise();
  }
}
