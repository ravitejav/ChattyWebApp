import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  message: string = "";
  alert: boolean = true;
  retryButton: boolean = false;
  emailid: string = "";

  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    this.message = this.data.message;
    this.retryButton = this.data.retryButton || false;
    this.alert = (this.data.alert === true || this.data.alert === false) ? this.data.alert : true;
  }

  handleOperation(reposone): void {
    if (this.alert) {
      this.dialogRef.close(reposone);
    } else {
      this.dialogRef.close({
        type: reposone,
        emailId: this.emailid,
      });
    }
  }

}
