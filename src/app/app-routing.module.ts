import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainGameComponent } from './main-game/main-game.component';

const routes: Routes = [
  { path: 'lang/:langCode', component: MainGameComponent },
  // { path: '', redirectTo: 'lang/en', component: MainGameComponent },
  { path: '**', component: MainGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
