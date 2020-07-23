import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MyErrorStateMatcher } from './../customModules/errorMatcher';
import { CustomErrorMessage } from '../customModules/CustomErrorMessage';
import { Firebase } from '../services/firebase/Firebase';
import { DialogComponent } from './../dialog/dialog.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {

  currentForm = 'login';
  loginForm: FormGroup = null;
  signupForm: FormGroup = null;
  errorMatcher = new MyErrorStateMatcher();
  dialogSubscriber: Subscription = null;

  constructor(private errorMessages: CustomErrorMessage, private firebase: Firebase, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.buildLoginForm();
    this.buildSignUpForm();
  }

  onFormChange(form): void {
    this.currentForm = form;
  }

  buildLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  buildSignUpForm(): void {
    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required]),
      fullName: new FormControl(null,
        [Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(20), Validators.required]
      ),
      nickName: new FormControl(null,
        [Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(20), Validators.required]
      )
    });
  }

  getError(formName, formControl): string {
    return this.errorMessages.getMessage(this[formName], formControl);
  }

  async googleSignin(): Promise<any> {
    try {
      const response: any = await this.firebase.signInWithGoogle();
      if (response.error) {
        return response;
      }
      this.router.navigateByUrl('/dashboard');
    }catch (error) {
      return error;
    }
    return {
      error: true,
      message: 'Failed to signIn',
    };
  }

  async loginWithGoogle(): Promise<void> {
    const response = await this.googleSignin();
    if (response.error) {
      this.dialogSubscriber = this.dialog.open(DialogComponent, {
        data: {
          message: response.message,
        }
      }).afterClosed().subscribe(async (result) => {
        if (result === 'retry') {
          await this.googleSignin();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.dialogSubscriber.unsubscribe();
  }

}
