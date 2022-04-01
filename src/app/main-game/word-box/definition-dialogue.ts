import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Word } from "./word-box.component";

@Component({
    selector: 'definition-dialog',
    templateUrl: './definition-dialog.html',
  })
  export class DefinitionDialogue {
    constructor(
      public dialogRef: MatDialogRef<DefinitionDialogue>,
      @Inject(MAT_DIALOG_DATA) public word: Word,
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }