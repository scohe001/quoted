import { Component, HostListener, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from '../services/cookie.service';
import { TutorialDialog } from './tutorial-dialog';
import { Language, LanguageService } from '../services/language.service';
import { ActivatedRoute } from '@angular/router';
import { DictionaryService } from '../services/dictionary.service';
import { HandicapDialog } from './handicap-dialog';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.scss']
})
export class MainGameComponent implements OnInit {

  private readonly MIN_TARGET_SCORE: number = 50;
  private readonly MAX_TARGET_SCORE: number = 250;
  private readonly SHOW_TUTORIAL_COOKIE: string = "SHOW_TUTORIAL_ON_LOAD";
  private readonly STARTING_DATE: Date = new Date(2022, 3, 22); // 04/22/22
  private readonly CHALLENGE_NUM: Number = Math.ceil(Math.abs((new Date()).getTime() - this.STARTING_DATE.getTime()) / (1000 * 3600 * 24));

  public targetScore: number = 100;
  public score: number = 0;
  public showWinParticles: boolean = false;
  public scoreSize: number = 16;

  private _textEntered: string = '';
  public get textEntered(): string {
    return this._textEntered;
  }
  public set textEntered(text: string) {
    this._textEntered = text;
    this.maybeShowWinParticles();
  }

  constructor(public dialog: MatDialog,
    public cookieManager: CookieService,
    public languageManager: LanguageService,
    public dictionaryManager: DictionaryService,
    private route: ActivatedRoute,) {  }

  ngOnInit(): void {
    // Set target score
    this.targetScore = this.getTodayTarget();

    // Setup language
    let langCode: string = this.route.snapshot.paramMap.get('langCode') ?? '';
    this.languageManager.setLanguage(langCode);

    // Show help or nah
    let tutorialCookieVal = this.cookieManager.getCookie(this.SHOW_TUTORIAL_COOKIE);
    if(!tutorialCookieVal || tutorialCookieVal === "TRUE") {
      this.cookieManager.setCookie(this.SHOW_TUTORIAL_COOKIE, "FALSE", 50);
      this.showHelp();
    }

    // For testing
    this.languageManager.languageChangedEmitter.subscribe(() => {
      console.log("Language changed!");
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    // console.log(event.key + " pressed");
  }

  public keyPressed(key: string) {
    this.textEntered += key;
  }

  public backspacePressed() {
    if(this.textEntered.length <= 0) { return; }

    this.textEntered = this.textEntered.substring(0, this.textEntered.length - 1);
  }

  public clear() {
    this.textEntered = '';
  }

  public showHelp() {
    const dialogRef = this.dialog.open(TutorialDialog, {
      width: '90vw',
      maxWidth: '600px',
    });
  }

  public showHandicap() {
    const dialogRef = this.dialog.open(HandicapDialog, {
      width: '90vw',
      maxWidth: '600px',
      data: this.dictionaryManager.getWordsWithScore(this.targetScore - this.score),
    });
  }

  public share() {
    if(this.score !== this.targetScore) {
      alert(this.languageManager.Language.mustBeZero);
      return;
    }

    let shareText: string = "Quoted #" + this.CHALLENGE_NUM + " (" + this.targetScore + ")\n\"" + this.textEntered.trim() + "\"";

    if(navigator.share) {
      navigator.share({
        title: document.title,
        text: shareText,
        // url: window.location.href
      })
      .then(() => console.log('Successful share'))
      .catch(error => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => alert("Copied to clipboard."))
        .catch((reason: any) => console.log("Clipboard copy failed: ", reason));
    }
  }

  public scoreChanged(score: number) {
    this.score = score;
    this.updateScoreSize();
  }

  readonly MAX_SCORE_SIZE: number = 48;
  readonly MIN_SCORE_SIZE: number = 16;

  private updateScoreSize(): void {
    let percentToTarget: number = (Math.abs(this.score - this.targetScore) / this.targetScore);
    var newSize: number = (Math.min(percentToTarget, 1) * (this.MIN_SCORE_SIZE - this.MAX_SCORE_SIZE)) + this.MAX_SCORE_SIZE;
    this.scoreSize = Math.round(newSize);
  }

  private getTodayTarget(): number {
    const datepipe: DatePipe = new DatePipe('en-US')
    let dateString  = datepipe.transform(new Date, 'ddMMYYYY') ?? '';
    let dateHash: string = (+dateString).toString(36);

    let randVal: number = this.xmur3(dateHash)();

    // console.log(randVal);
    let randThousand: number = +randVal.toString().slice(randVal.toString().length - 4);
    // console.log(randThousand);
    let todayTarget: number = ((randThousand / 10000) * (this.MAX_TARGET_SCORE - this.MIN_TARGET_SCORE)) + this.MIN_TARGET_SCORE;
    // console.log(todayTarget);

    return Math.round(todayTarget);
  }

  private xmur3(str: any) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    } return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
  }

  private winTimeout: any = null;
  private maybeShowWinParticles(): void {
    if(this.winTimeout) {
      // We're still checking a win, so cancel that
      clearTimeout(this.winTimeout);
    }

    if(this.score !== this.targetScore) {
      this.showWinParticles = false;
      return;
    }

    this.winTimeout = setTimeout(() => {
      // If this is still true after the wait, then show win
      if(this.score === this.targetScore) {
        this.showWinParticles = true;
      }
      this.winTimeout = null;
    }, 1000);
  }

  public test() {
    if(this.languageManager.selectedLang === Language.English) {
      this.languageManager.setLanguage(Language.Portuguese);
    } else {
      this.languageManager.setLanguage(Language.English);
    }
  }

}
