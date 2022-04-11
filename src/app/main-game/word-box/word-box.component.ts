import { Component, OnInit, LOCALE_ID, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, NgControl, NgModel, Validators } from '@angular/forms';
import { HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DictionaryService, Word, WordState } from '../../services/dictionary.service'
import { DictionaryResponse } from '../../interfaces/dictionaryResponse';
import { DefinitionDialogue } from './definition-dialogue';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-word-box',
  templateUrl: './word-box.component.html',
  styleUrls: ['./word-box.component.scss']
})
export class WordBoxComponent implements OnInit {

  wordControl: FormControl = new FormControl('', Validators.required);

  constructor(public dictionaryManager: DictionaryService,
    public dialog: MatDialog,
    public languageManager: LanguageService) {  }

  ngOnInit(): void {
    this.wordInput = '';
  }
  
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
    let oldWords: Array<Word> = this.words.map(word => word.deepCopy());

    this.words = []; // Clear what's already in there

    var values: Array<string> = value.split(' ');

    values.forEach((word, indx) => {
      word = word.split('').reduce((finalWord, currLetter) => finalWord += Word.isWordChar(currLetter) ? currLetter : '', '');
      if(word.length === 0) { return; }

      var newWord: Word = new Word(word, this.dictionaryManager, this.languageManager);

      var oldWord: Word | undefined = oldWords.find((w) => {
        return w.word === newWord.word;
      })

      if(oldWord && oldWord.isGood !== WordState.PENDING_INPUT) {
        newWord.isGood = oldWord.isGood;
        newWord.definition = oldWord.definition;
      } else if (indx + 1 < values.length || Word.isEndPunctuation(value[value.length - 1])) {
        newWord.lookupWord();
      } else {
        newWord.setPendingState();
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
