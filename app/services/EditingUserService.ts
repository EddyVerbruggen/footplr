import BackendService from "./BackendService";
import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import User from "../models/User";

export default class EditingUserService extends BackendService {
  public userWrapper: { user: User } = {user: undefined};

  // poor man's observable.. on any page you're currently at, you can register this callback
  // note that this has not been tested with more than one page, so an Array may be required, etc
  public anyPageCallback: Function = null;

  private userRef: firestore.DocumentReference;
  private userLoginUnsubscribe;

  watchUser(): void {
    this.listenToUserUpdates(this.userWrapper.user.id);
  }

  private listenToUserUpdates(id: string) {
    console.log(">> id: " + id);
    this.userRef = firebase.firestore.collection("users").doc(id);

    this.userLoginUnsubscribe = this.userRef.onSnapshot(doc => {
      if (doc.exists) {
        this.syncUserData(doc);

        if (this.anyPageCallback) {
          this.anyPageCallback();
        }
      } else {
        console.log("No such document!");
      }
    });
    return null;
  }

  private async syncUserData(doc: firestore.DocumentSnapshot): Promise<void> {
    const userData = <User>doc.data();
    const user = this.user;
    userData.id = doc.id;
    user.id = userData.id;
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
    this.userWrapper.user = <User>userData;
    this.user = user;
    return null;
  }

  async updateUserDataInFirebase(userData): Promise<void> {
    return this.userRef.update(userData);
  }

  async clearListener() {
    this.user = null;
    this.userLoginUnsubscribe();
  }
}
