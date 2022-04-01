import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {

  public keys: Array<Array<string>> = ["qwertyuiop".split(''),
                                       "asdfghjkl".split(''),
                                       "zxcvbnm".split('')];


  @Output() keyPressed: EventEmitter<string> = new EventEmitter();                                     
  @Output() backspacePressed: EventEmitter<void> = new EventEmitter();                                     

  constructor() { }

  ngOnInit(): void {
  }

  public _keyPressed(key: string): void {
    console.log(key + " pressed");
    this.keyPressed.emit(key);
  }

  public _backspacePressed(): void {
    console.log("Backspace pressed");
    this.backspacePressed.emit();
  }

}
