import { Component, OnInit, LOCALE_ID, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, NgControl, NgModel, Validators } from '@angular/forms';
import { HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DictionaryService } from '../../services/dictionary.service'
import { DictionaryResponse } from '../../interfaces/dictionaryResponse';
import { DefinitionDialogue } from './definition-dialogue';

@Component({
  selector: 'app-word-box',
  templateUrl: './word-box.component.html',
  styleUrls: ['./word-box.component.scss']
})
export class WordBoxComponent implements OnInit {
  
  @Input() public targetScore: number = 100;
  public words: Array<Word> = []

  public get keyboardText(): string {
    return this.textEntered;
  }

  public set keyboardText(value: string) {
    this.wordInput = value;
  }

  @Output() public scoreChange = new EventEmitter<number>();
  public _score: number = 0;
  public set score(value: number) {
    this._score = value;
    this.scoreChange.emit(this._score);
  }

  public get score(): number {
    return this._score;
  }

  @Output() public wordInputChange = new EventEmitter<string>();
  public textEntered: string = '';
  @Input() public set wordInput(value: string) {
    if(value.length >= 2
      && value[value.length - 1] == value[value.length - 2]
      && value[value.length - 1] === ' ')
      { return; }
    
    if(value === this.textEntered) { return; }

    this.textEntered = value;
    let upperWord: string = value.toUpperCase();
    this.parseWords(upperWord);

    this.score = this.words.reduce((sum, current) => sum + current.score, 0);
    this.wordInputChange.emit(this.wordInput);
  }

  public get wordInput(): string {
    return this.textEntered;
  }

  wordControl: FormControl = new FormControl('', Validators.required);

  constructor(public dictionaryManager: DictionaryService,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
    this.wordInput = '';

    // Doesn't work to bring up mobile keyboard on load
    // let wordBoxElem = document.getElementById("wordbox");
    // if(wordBoxElem) {
    //   wordBoxElem.focus();
    //   wordBoxElem.click();
    // }
  }

  public test() {
    console.log(this.keyboardText);
  }

  public wordTap(word: Word) {
    const dialogRef = this.dialog.open(DefinitionDialogue, {
      width: '250px',
      data: word,
    });
  }

  private parseWords(value: string) {
    // Deep copy
    let oldWords: Array<Word> = JSON.parse(JSON.stringify(this.words));

    this.words = []; // Clear what's already in there

    var values: Array<string> = value.split(' ');

    values.forEach((word, indx) => {
      word = word.split('').reduce((finalWord, currLetter) => finalWord += Word.isWordChar(currLetter) ? currLetter : '', '');
      if(word.length === 0) { return; }

      var newWord: Word = new Word(word, this.dictionaryManager);

      var oldWord: Word | undefined = oldWords.find((w) => {
        return w.word === newWord.word;
      })

      if(oldWord && oldWord.isGood !== WordState.PENDING_INPUT) {
        newWord.isGood = oldWord.isGood;
        newWord.definition = oldWord.definition;
      } else if (indx + 1 < values.length || Word.isEndPunctuation(value[value.length - 1])) {
        newWord.lookupWord();
      } else {
        newWord.isGood = WordState.PENDING_INPUT;
        newWord.definition = "Waiting for input to end. Add a space to force a lookup operation.";
      }

      this.words.push(newWord);
    });

    // Scroll the table to the bottom
    var wordTable  = document.getElementById("wordTable");
    if(wordTable) { wordTable.scrollTop = wordTable.scrollHeight; }

    // console.log("Finishing parse", this.words);
  }

  public rowClicked(word: Word) {
    console.log(word);

    const dialogRef = this.dialog.open(DefinitionDialogue, {
      width: '250px',
      data: word,
    });
  }

  public getWordClass(word: Word) {
    return word.isGood === WordState.GOOD ? 'goodWord'
      : word.isGood === WordState.PENDING_INPUT ? 'pendingWord'
      : 'badWord';
  }

  public clear() {
    this.wordInput = '';
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
    public dictionaryManager: DictionaryService) {
    // console.log("Constructor called with: " + word);
    this.word = word;
    this.definition = '';
    this.isGood = WordState.PENDING_INPUT;
    this.score = 0;

    this.recalcScore();
  }

  public recalcScore() {
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

  public async lookupWord() {
    if(this.word.length === 0) { return; }

    // console.log("LOOKING UP: " + this.word);

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
