import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-word-box',
  templateUrl: './word-box.component.html',
  styleUrls: ['./word-box.component.scss']
})
export class WordBoxComponent implements OnInit {

  public score: number = 0;
  public word: string = '';

  public get wordInput(): string {
    return this.word;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    console.log(event.key + " pressed");
  }

  public set wordInput(value: string) {
    this.word = value;
    let lowerWord: string = value.toLowerCase();
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

  constructor() { }

  ngOnInit(): void {
  }

}
