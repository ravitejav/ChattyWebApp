import { Injectable } from '@angular/core';

import { Firebase } from './firebase/Firebase';
import { firebaseUserResultTransformer } from './Transforms';

@Injectable()
export class LoginService {

  constructor(private firebase: Firebase) {}

  public loginWithEmailAndPassword(loginDetails): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebase.auth().signInWithEmailAndPassword(loginDetails.email, loginDetails.password)
      .then(results => {
        resolve(firebaseUserResultTransformer(results));
      }).catch(error => {
        reject({
          error: true,
          message: error.message,
        });
      });
    });
  }
}
