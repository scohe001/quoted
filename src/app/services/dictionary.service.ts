import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DictionaryResponse } from '../interfaces/dictionaryResponse';
import { Observable } from 'rxjs';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private http: HttpClient,) { }

  public async LookupWord(word: string): Promise<Array<DictionaryResponse>> {
    return await this.http.get<Array<DictionaryResponse>>('https://api.dictionaryapi.dev/api/v2/entries/en/' + word).toPromise();
  }
}

export enum WordState {
  GOOD,
  DEF_NOT_FOUND,
  PENDING_INPUT,
}

export class Word {
  public word: string;
  public definition: string;
  public isGood: WordState;
  public score: number;

  constructor(word: string,
    public dictionaryManager: DictionaryService,
    public languageManager: LanguageService,) {

    this.word = word;
    this.definition = '';
    this.isGood = WordState.PENDING_INPUT;
    this.score = 0;

    this.recalcScore();
  }

  public recalcScore(): void {
    let upperWord: string = this.word.toUpperCase();
    this.score = 0;

    for (let index = 0; index < upperWord.length; index++) {
      if(!Word.isAlpha(upperWord[index])) { continue; }

      if(Word.isVowel(upperWord[index])) {
        this.score -= upperWord[index].charCodeAt(0) - 'A'.charCodeAt(0) + 1;
      } else {
        this.score += upperWord[index].charCodeAt(0) - 'A'.charCodeAt(0) + 1;
      }
    }
  }

  public setPendingState(): void {
    if(this.shouldLookupWords()) {
      this.isGood = WordState.PENDING_INPUT;
      this.definition = "Waiting for input to end. Add a space to force a lookup operation.";
    } else {
      this.isGood = WordState.GOOD;
      this.definition = this.languageManager.Language.lookupsNotSupported;
    }
  }

  public async lookupWord() {
    if(this.word.length === 0 || !this.shouldLookupWords()) { return; }

    this.dictionaryManager.LookupWord(this.word)
      .then((r: Array<DictionaryResponse>) => { 
        // console.log(r);
        // console.log(r[0]);
        // console.log(r.meanings);
        // console.log(r.meanings[0].definitions);
        this.definition = r[0].meanings[0].definitions[0].definition;
        this.isGood = WordState.GOOD;
      })
      .catch((err: any) => {
        this.definition = 'Word not found.';
        this.isGood = WordState.DEF_NOT_FOUND;
        console.log(err);
      });
  }

  private shouldLookupWords(): boolean {
    // Lookups only enabled for English
    return this.languageManager.Language === this.languageManager.DefaultLanguage;
  }

  public static isAlpha(val: string) {
    return  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(val);
  }

  public static isVowel(val: string) {
    return "AEIOU".includes(val);
  }

  public static isWordChar(val: string) {
    return this.isAlpha(val) || val === "'";
  }

  public static isEndPunctuation(val: string) {
    return ".,!?:;)".includes(val);
  }
}