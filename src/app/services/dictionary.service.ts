import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DictionaryResponse } from '../interfaces/dictionaryResponse';
import { Observable } from 'rxjs';
import { LanguageService } from './language.service';
import * as scoreDictionary from '../../assets/scoreDictionary.json'


@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private http: HttpClient,) { }

  public async LookupWord(word: string): Promise<Array<DictionaryResponse> | undefined> {
    return await this.http.get<Array<DictionaryResponse>>('https://api.dictionaryapi.dev/api/v2/entries/en/' + word).toPromise();
  }

  public getWordsWithScore(score: number) : string[] {
    return (scoreDictionary as any)[score.toString()];
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
    this.isGood = WordState.PENDING_INPUT; // Need this for TS to be happy but it'll get overwritten below
    this.score = 0;

    this.setPendingState();
    this.recalcScore();
  }

  public recalcScore(): void {
    let upperWord: string = this.word.toUpperCase();
    this.score = 0;

    for (let index = 0; index < upperWord.length; index++) {
      let char: string = Word.stripAccents(upperWord[index]);

      if(!Word.isAlpha(char)) { continue; }

      if(Word.isVowel(char)) {
        this.score -= char.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
      } else {
        this.score += char.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
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

  public deepCopy(): Word {
    var word: Word = new Word(this.word, this.dictionaryManager, this.languageManager);
    word.isGood = this.isGood;
    word.score = this.score;
    word.definition = this.definition;

    return word;
  }

  public async lookupWord() {
    if(this.word.length === 0 || !this.shouldLookupWords()) { return; }

    this.dictionaryManager.LookupWord(this.word)
      .then((r: Array<DictionaryResponse> | undefined) => { 
        // console.log(r);
        // console.log(r[0]);
        // console.log(r.meanings);
        // console.log(r.meanings[0].definitions);
        if(!r) {
          this.definition = 'Word not found.';
          this.isGood = WordState.DEF_NOT_FOUND;
          return;
        }
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

  public static stripAccents(val: string): string {
    return val.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }

  // Should we count this in the score?
  public static isAlpha(val: string): boolean {
    return  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(val);
  }

  public static isVowel(val: string): boolean {
    return "AEIOU".includes(val);
  }

  // Should we leave it in what we display?
  // NOT used for scoring
  public static isWordChar(val: string): boolean {
    return this.isAlpha(this.stripAccents(val)) || val === "'";
  }

  public static isEndPunctuation(val: string): boolean {
    return ".,!?:;)".includes(val);
  }
}