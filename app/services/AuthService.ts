import BackendService from "./BackendService";
import * as firebase from 'nativescript-plugin-firebase';
import { firestore } from "nativescript-plugin-firebase";
import User from "../models/User";
import { getString } from "tns-core-modules/application-settings";

export default class AuthService extends BackendService {

  public userWrapper: {user: User} = { user: undefined };

  private userRef: firestore.DocumentReference;
  private userLoginUnsubscribe;

  isLoggedIn() {
    console.log(">>> isLoggedIn");
    if (!!getString(this.userKey)) {
      // TODO move this out of this function
      console.log(">>> this.userWrapper");
      this.userWrapper.user = this.user;
      this.listenToUserUpdates(this.user.id);
      return true;
    } else {
      return false;
    }
  }

  async register(user) {
    const createdUser = await firebase.createUser({
      email: user.email,
      password: user.password
    });
    return await firebase.firestore.set("users", createdUser.uid, {});
  }

  async login(fUser) {
    const firebaseUser: firebase.User = await firebase.login({
      type: firebase.LoginType.PASSWORD,
      passwordOptions: {
        email: fUser.email,
        password: fUser.password
      }
    });


    const userDoc = await firebase.firestore.getDocument("users", firebaseUser.uid);

    const user = <User>userDoc.data();
    user.id = firebaseUser.uid;
    user.email = firebaseUser.email;
    this.user = user;

    await this.syncUserData(userDoc);

    this.listenToUserUpdates(firebaseUser.uid);
    return user;
  }

  private listenToUserUpdates(id: string) {
    this.userRef = firebase.firestore.collection("users").doc(id);

    this.userLoginUnsubscribe = this.userRef.onSnapshot(doc => {
      if (doc.exists) {
        this.syncUserData(doc);
      } else {
        console.log("No such document!");
      }
    });
    return null;
  }

  private async syncUserData(doc: firestore.DocumentSnapshot): Promise<void> {
    console.log("User document data:", JSON.stringify(doc.data()));
    const userData = <User>doc.data();
    const user = this.user;
    user.admin = userData.admin;
    user.birthdate = userData.birthdate;
    user.club = userData.club;
    user.playsin = userData.playsin;
    user.trains = userData.trains;
    user.firstname = userData.firstname;
    user.lastname = userData.lastname;
    user.height = userData.height;
    user.weight = userData.weight;
    user.picture = userData.picture;
    user.position = userData.position;
    user.scores = userData.scores;
    // const lastScores: firestore.DocumentReference = userData.lastscores;
    // if (lastScores) {
    //   user.player.lastscoresData = (await lastScores.get()).data();
    //   userData.lastscoresData = user.player.lastscoresData;
    // }
    this.userWrapper.user = <User>userData;
    this.user = user;
    return null;
  }

  async updateUserDataInFirebase(userData) {
    return this.userRef.update(userData);
  }

  async resetPassword(email) {
    const result = await firebase.resetPassword({
      email: email
    });
    return JSON.stringify(result);
  }

  async logout() {
    this.user = null;
    this.userLoginUnsubscribe();
    return firebase.logout();
  }
}
