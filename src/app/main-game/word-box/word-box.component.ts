import { Component, OnInit, LOCALE_ID, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, NgControl, NgModel, Validators } from '@angular/forms';
import { HostListener } from '@angular/core';
import { IKeyboardLayout, MatKeyboardComponent, MatKeyboardRef, MatKeyboardService, MAT_KEYBOARD_LAYOUTS } from 'angular-onscreen-material-keyboard';  // '@ngx-material-keyboard/core';

@Component({
  selector: 'app-word-box',
  templateUrl: './word-box.component.html',
  styleUrls: ['./word-box.component.scss']
})
export class WordBoxComponent implements OnInit {
  
  public score: number = 0;
  public targetScore: number = 100;
  public textEntered: string = '';
  public words: Array<Word> = []
  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    console.log(event.key + " pressed");
  }

  public get keyboardText(): string {
    return this.textEntered;
  }

  public set keyboardText(value: string) {
    this.wordInput = value;
  }

  public get wordInput(): string {
    return this.textEntered;
  }

  public set wordInput(value: string) {
    this.textEntered = value;
    let lowerWord: string = value.toLowerCase();
    this.parseWords(lowerWord);
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

  private isAlpha(val: string) {
    return  "abcdefghijklmnopqrstuvwxyz".includes(val);
  }

  private isVowel(val: string) {
    return "aeiou".includes(val);
  }

  wordControl: FormControl = new FormControl('', Validators.required);

  constructor() {  }

  ngOnInit(): void {
    this.wordInput = '';

    // TODO: Calc some unique targetScore based on date
    // targetScore = ???;
  }

  public test() {
    console.log(this.keyboardText);
  }

  public keyPressed(key: string) {
    this.wordInput += key;
  }

  public backspacePressed() {
    if(this.wordInput.length <= 0) { return; }

    this.wordInput = this.wordInput.substring(0, this.wordInput.length - 1);
  }

  public clear() {
    this.wordInput = '';
  }

  private parseWords(value: string) {
    this.words = []; // Clear what's already in there

    var values: Array<string> = value.split(' ');

    values.forEach(word => {
      if(word.length === 0) { return; }

      // TODO: Check the dictionary API here
      this.words.push(new Word(word));
        // {word: word, definition: '', isGood: true});
    });

    if(this.words.length === 0 || values[values.length - 1].length === 0) {
      this.words.push(new Word(''));
    }


    // On second thought, maybe we don't want this?
    // // Flip the word they're entering to good
    // if(this.words.length > 0) {
    //   this.words[this.words.length - 1].isGood = true;
    // }

    console.log(this.words);
  }
}

class Word {
  public word: string;
  public definition: string;
  public isGood: boolean;

  constructor(word: string) {
    // console.log("Constructor called with: " + word);
    this.word = word;

    // TODO: Check dictionary API here
    // TODO: EXCEPT in the case word.length === 0
    this.definition = '';
    this.isGood = true;
  }
}
