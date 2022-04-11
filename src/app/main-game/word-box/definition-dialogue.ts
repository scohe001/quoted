import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { LanguageService } from "../../services/language.service";
import { Word } from "./word-box.component";

@Component({
    selector: 'definition-dialog',
    templateUrl: './definition-dialog.html',
  })
  export class DefinitionDialogue {
    constructor(
      public dialogRef: MatDialogRef<DefinitionDialogue>,
      @Inject(MAT_DIALOG_DATA) public word: Word,
      public languageManager: LanguageService
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }