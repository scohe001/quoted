import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
// import { Word } from "./word-box.component";

@Component({
  selector: 'tutorial-dialog',
  templateUrl: './tutorial-dialog.html',
  styleUrls: ['./tutorial-dialog.scss']
})
export class TutorialDialog {
  constructor(
    public dialogRef: MatDialogRef<TutorialDialog>,
    // @Inject(MAT_DIALOG_DATA) public word: Word,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}