import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { MyErrorStateMatcher } from './../customModules/errorMatcher';
import { CustomErrorMessage } from '../customModules/CustomErrorMessage';
import { Firebase } from '../services/firebase/Firebase';
import { DialogComponent } from './../dialog/dialog.component';
import { LoginService } from '../services/loginService';
import { SignUpService } from '../services/SignUpService';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers: [LoginService, SignUpService]
})
export class HomePageComponent implements OnInit, OnDestroy {

  currentForm = 'login';
  loginForm: FormGroup = null;
  signupForm: FormGroup = null;
  errorMatcher = new MyErrorStateMatcher();
  dialogSubscriber: Array<Subscription> = [];

  constructor(
    private errorMessages: CustomErrorMessage,
    private firebase: Firebase,
    private router: Router,
    private dialog: MatDialog,
    private loginService: LoginService,
    private signUpService: SignUpService,
    ) { }

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
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
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
      this.dialogSubscriber.push(this.dialog.open(DialogComponent, {
        data: {
          message: response.message,
          retryButton: true,
        }
      }).afterClosed().subscribe(async (result) => {
        if (result === 'retry') {
          await this.googleSignin();
        }
      }));
    }
  }

  loginWithCreds(): void {
    if (this.loginForm.valid) {
      this.loginService.loginWithEmailAndPassword(this.loginForm.value)
        .then(response => {
          console.log(response);
          this.router.navigateByUrl('/dashboard');
        }).catch(error => {
          this.dialog.open(DialogComponent, {
            data: {
              message: error.message,
              retryButton: false,
            }
          });
        });
    }
  }

  signUp(): void {
    if (this.signupForm.valid) {
      this.signUpService.addUserAndSendOtp(this.signupForm.value, this.signUpHandler.bind(this));
    }
  }

  signUpHandler(response: any): void {
    this.dialog.open(DialogComponent, {
      data: {
        message: response.message,
        retryButton: false,
      }
    });
    this.currentForm = 'login';
  }

  ngOnDestroy(): void {
    this.dialogSubscriber.forEach(x => x.unsubscribe());
  }

}
