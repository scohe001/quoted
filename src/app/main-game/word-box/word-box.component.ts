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

  private keyboardRef: MatKeyboardRef<MatKeyboardComponent>;

  @ViewChild('keyboardBox', { read: ElementRef })
   keyboardAttachedElement !: ElementRef;

  @ViewChild('keyboardBox', { read: NgModel })
   keyboardAttachedControl !: NgControl;
  
  public score: number = 0;
  public word: string = '';
  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    console.log(event.key + " pressed");
  }

  public get keyboardText(): string {
    return this.word;
  }

  public set keyboardText(value: string) {
    this.wordInput = value;
  }

  public get wordInput(): string {
    return this.word;
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

  // constructor() { }
  // ngOnInit(): void { }

  constructor(private _keyboardService: MatKeyboardService,) { 
    this.keyboardRef = this._keyboardService.open('', {
      darkTheme: true,
    });


  }

  ngOnInit(): void {
    // setTimeout to give the view a sec to come up
    setTimeout(() => {
      // reference the input element
      this.keyboardRef.instance.setInputInstance(this.keyboardAttachedElement);
      // set control
      this.keyboardRef.instance.attachControl(this.keyboardAttachedControl.control as AbstractControl);
    })
  }

  public test() {
    console.log(this.keyboardText);
  }

}
