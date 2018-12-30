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
    this.userRef = firebase.firestore.collection("users").doc(id);

    this.userLoginUnsubscribe = this.userRef.onSnapshot(doc => {
      if (doc.exists) {
        this.syncUserData(doc);

        if (this.anyPageCallback) {
          this.anyPageCallback(doc.data());
        }
      } else {
        console.log("No such document!");
      }
    });
    return null;
  }

  private syncUserData(doc: firestore.DocumentSnapshot): void {
    const userData = <User>doc.data();
    userData.id = doc.id;
    this.userWrapper.user = <User>userData;
    this.user = <User>userData;
  }

  async updateUserDataInFirebase(userData): Promise<void> {
    return this.userRef.update(userData);
  }

  async clearListener() {
    this.user = null;
    this.userLoginUnsubscribe();
  }
}
