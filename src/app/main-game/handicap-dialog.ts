import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { LanguageService } from "../services/language.service";
import { MatTableModule } from "@angular/material/table";
// import { Word } from "./word-box.component";

@Component({
  selector: 'handicap-dialog',
  templateUrl: './handicap-dialog.html',
  styleUrls: ['./handicap-dialog.scss'],
})
export class HandicapDialog {
  constructor(
    public dialogRef: MatDialogRef<HandicapDialog>,
      @Inject(MAT_DIALOG_DATA) public words: Array<string>,
      public languageManager: LanguageService,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}