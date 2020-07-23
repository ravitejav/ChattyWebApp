import { Injectable } from "@angular/core";

import { Firebase } from "./firebase/Firebase";

@Injectable()
export class SignUpService {

  constructor(private firebase: Firebase) {}

  addUserAndSendOtp({email, password, fullName, nickName}, responseHandler): void {
    this.addUser(email, password)
      .then((registerUser) => {
        Promise.all([this.sendOtp(), this.updateUser(fullName, nickName)])
          .then((res) =>
            responseHandler({
              signup: true,
              emailVerification: false,
              message:
                'User is registered succesfully, Verification email is sent to registered emailId',
            }),
          )
          .catch((err) =>
            responseHandler({
              error: true,
              message: err.message,
            }),
          );
      })
      .catch((error) =>
        responseHandler({
          error: true,
          message: error.message,
        }),
      );
  }

  addUser(email, password): Promise<any> {
    return this.firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  sendOtp(): Promise<any> {
    return this.firebase.auth().currentUser.sendEmailVerification();
  }

  updateUser(fullName, nickName): Promise<any> {
    return this.firebase.auth().currentUser.updateProfile({
      displayName: fullName + '##' + nickName,
    });
  }
}
