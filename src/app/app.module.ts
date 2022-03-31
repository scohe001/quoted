import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainGameComponent } from './main-game/main-game.component';
import { WordBoxComponent } from './main-game/word-box/word-box.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'

import { MatButtonModule } from '@angular/material/button';
import { MatKeyboardModule } from 'angular-onscreen-material-keyboard';

@NgModule({
  declarations: [
    AppComponent,
    MainGameComponent,
    WordBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MatFormFieldModule,
    MatSliderModule,
    MatInputModule,
    FormsModule,
    CommonModule,

    MatButtonModule,
    MatKeyboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
