import { Component, HostListener, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.scss']
})
export class MainGameComponent implements OnInit {

  private readonly MIN_TARGET_SCORE: number = 50;
  private readonly MAX_TARGET_SCORE: number = 250;

  public targetScore: number = 100;
  public textEntered: string = '';

  constructor() { }

  ngOnInit(): void {
    this.targetScore = this.getTodayTarget();

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

}
