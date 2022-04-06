import { Component, OnInit, LOCALE_ID, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, NgControl, NgModel, Validators } from '@angular/forms';
import { HostListener } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DictionaryService } from '../../services/dictionary.service'
import { DictionaryResponse } from '../../interfaces/dictionaryResponse';
import { DefinitionDialogue } from './definition-dialogue';

@Component({
  selector: 'app-word-box',
  templateUrl: './word-box.component.html',
  styleUrls: ['./word-box.component.scss']
})
export class WordBoxComponent implements OnInit {
  
  public score: number = 0;
  @Input() public targetScore: number = 100;
  public textEntered: string = '';
  public words: Array<Word> = []

  public get keyboardText(): string {
    return this.textEntered;
  }

  public set keyboardText(value: string) {
    this.wordInput = value;
  }


  public get wordInput(): string {
    return this.textEntered;
  }

  @Output() public wordInputChange = new EventEmitter<string>();
  @Input() public set wordInput(value: string) {
    if(value.length >= 2
      && value[value.length - 1] == value[value.length - 2]
      && value[value.length - 1] === ' ')
      { return; }

    this.textEntered = value;
    let lowerWord: string = value.toLowerCase();
    this.parseWords(lowerWord);

    this.score = this.words.reduce((sum, current) => sum + current.score, 0);
    this.wordInputChange.emit(this.wordInput);
  }

  wordControl: FormControl = new FormControl('', Validators.required);

  constructor(public dictionaryManager: DictionaryService,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
    this.wordInput = '';

    // TODO: Calc some unique targetScore based on date
    // targetScore = ???;
    let wordBoxElem = document.getElementById("wordbox");
    if(wordBoxElem) {
      wordBoxElem.focus();
      wordBoxElem.click();
    }
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
    var newWords: Array<Word>;

    this.words = []; // Clear what's already in there

    var values: Array<string> = value.split(' ');

    values.forEach(word => {
      if(word.length === 0) { return; }

      var newWord: Word = new Word(word, this.dictionaryManager);

      var oldWord: Word | undefined = oldWords.find((w) => {
        return w.word === newWord.word;
      })

      if(oldWord) {
        newWord.isGood = oldWord.isGood;
        newWord.definition = oldWord.definition;
      } else {
        newWord.lookupWord();
      }

      this.words.push(newWord);
      // this.words.push(new Word(word, this.dictionaryManager));
    });

    if(this.words.length === 0 || values[values.length - 1].length === 0) {
      this.words.push(new Word('', this.dictionaryManager));
    }

    // On second thought, maybe we don't want this?
    // // Flip the word they're entering to good
    // if(this.words.length > 0) {
    //   this.words[this.words.length - 1].isGood = true;
    // }

    console.log(this.words);
  }
}

export class Word {
  public word: string;
  public definition: string;
  public isGood: boolean;
  public score: number;

  constructor(word: string,
    public dictionaryManager: DictionaryService) {
    // console.log("Constructor called with: " + word);
    this.word = word;
    this.definition = '';
    this.isGood = true;
    this.score = 0;

    this.recalcScore();
  }

  public recalcScore() {
    let lowerWord: string = this.word.toLowerCase();
    this.score = 0;

    for (let index = 0; index < lowerWord.length; index++) {
      if(!this.isAlpha(lowerWord[index])) { continue; }

      if(this.isVowel(lowerWord[index])) {
        this.score -= lowerWord[index].charCodeAt(0) - 'a'.charCodeAt(0) + 1;
      } else {
        this.score += lowerWord[index].charCodeAt(0) - 'a'.charCodeAt(0) + 1;
      }
    }
  }

  public async lookupWord() {
    if(this.word.length === 0) { return; }

    // console.log("LOOKING UP: " + this.word);

    this.dictionaryManager.LookupWord(this.word)
      .then((r: Array<DictionaryResponse>) => { 
        console.log(r);
        // console.log(r[0]);
        // console.log(r.meanings);
        // console.log(r.meanings[0].definitions);
        this.definition = r[0].meanings[0].definitions[0].definition;
        this.isGood = true;
      })
      .catch((err: any) => {
        this.definition = 'Word not found.';
        this.isGood = false;
        console.log(err);
      });
  }

  private isAlpha(val: string) {
    return  "abcdefghijklmnopqrstuvwxyz".includes(val);
  }

  private isVowel(val: string) {
    return "aeiou".includes(val);
  }
}
