import {environment} from "../../../environments/environment";
import * as firebase from 'firebase';

import { firebaseUserResultTransformer } from '../Transforms';

export class Firebase {
  firebase: firebase.app.App;
  provider: firebase.auth.GoogleAuthProvider;
  constructor() {
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.firebase = firebase.initializeApp(environment.firebaseConfig);
  }

  auth(): firebase.auth.Auth {
    return this.firebase.auth();
  }

  database(): firebase.database.Database {
    return this.firebase.database();
  }

  signInWithGoogle(): Promise<Object> {
    return new Promise((resolve, reject) => this.firebase.auth().signInWithPopup(this.provider).then(results => {
      resolve(firebaseUserResultTransformer(results));
    }).catch(error => {
      reject({
        error: true,
        message: "Failed to signIn",
      });
    }));
  }

}
