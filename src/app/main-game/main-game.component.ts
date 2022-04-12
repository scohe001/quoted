import { Component, HostListener, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from '../services/cookie.service';
import { TutorialDialog } from './tutorial-dialog';
import { Language, LanguageService } from '../services/language.service';
import { ActivatedRoute } from '@angular/router';
import { MoveDirection, OutMode, SizeMode, ShapeType, RotateDirection } from 'tsparticles-engine';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.scss']
})
export class MainGameComponent implements OnInit {

  private readonly MIN_TARGET_SCORE: number = 50;
  private readonly MAX_TARGET_SCORE: number = 250;
  private readonly SHOW_TUTORIAL_COOKIE: string = "SHOW_TUTORIAL_ON_LOAD";

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
    private route: ActivatedRoute,) {  }

  ngOnInit(): void {
    this.targetScore = this.getTodayTarget();

    let tutorialCookieVal = this.cookieManager.getCookie(this.SHOW_TUTORIAL_COOKIE);
    if(!tutorialCookieVal || tutorialCookieVal === "TRUE") {
      this.cookieManager.setCookie(this.SHOW_TUTORIAL_COOKIE, "FALSE", 50);
      this.showHelp();
    }

    let langCode: string = this.route.snapshot.paramMap.get('langCode') ?? '';
    this.languageManager.setLanguage(langCode);

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

  public share() {
    if(this.score !== this.targetScore) {
      alert(this.languageManager.Language.mustBeZero);
      return;
    }

    let shareText: string = "Quoted #69 (" + this.targetScore + ")\n\"" + this.textEntered.trim() + "\"";

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

    console.log(randVal);
    let randThousand: number = +randVal.toString().slice(randVal.toString().length - 4);
    console.log(randThousand);
    let todayTarget: number = ((randThousand / 10000) * (this.MAX_TARGET_SCORE - this.MIN_TARGET_SCORE)) + this.MIN_TARGET_SCORE;
    console.log(todayTarget);

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

  public particleOptions = {
    fpsLimit: 60,
    // Default particles (we don't want since we're just using emitter)
    particles: {
      number: {
        value: 0
      }
    },

    emitters: {
      direction: MoveDirection.none,
      position: { "x": 50, "y": 50 },
      size: {
        width: 50,
        height: 50,
        mode: SizeMode.precise,
      },
      rate: {
        quantity: 1,
        delay: .1,
      },

      particles: {
        color: {
          value: ["#06070E", "#29524A", "#94A187", "#C5AFA0", "#E9BCB7"],
	        animation: {
            h: {
              count: 0,
              enable: true,
              offset: 0,
              speed: 30,
              sync: true
            },
            s: {
              enable: false,
            },
            l: {
              enable: false,
            },
          }
        },
        links: {
          enable: false,
          color: "#a8a8a8",
          distance: 150,
        },
        move: {
          enable: true,
          outModes: OutMode.destroy,
        },
        rotate: {
          direction: RotateDirection.random,
          value: {
            min: -180,
            max: 180,
          },
          animation: {
            enable: true,
            speed: 3,
            sync: false,
          },
        },
        shape: {
          type: ShapeType.char,
          "character": {
            "value": "abcdefghijklmnopqrstuvwxyz".split(''),
          },
        },
        size: {
          value: 10,
        },
        wobble: {
          enable: true,
          distance: {
            min: -30,
            max: 30,
          },
          speed: {
            min: -15,
            max: 15,
          }
        },
      },
      fullScreen: {
        enable: false,
        zIndex: 0,
      },
    }
  };

}
