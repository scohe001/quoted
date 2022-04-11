import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Word } from "../../services/dictionary.service";
import { LanguageService } from "../../services/language.service";

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