import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import Team from "~/models/team";
import User from "~/models/User";

export default class EditingUserService {
  // TODO with team added, the name is a bit silly
  public userWrapper: { user: User, team: Team } = {user: undefined, team: undefined};

  // poor man's observable.. on any page you're currently at, you can register this callback
  // note that this has not been tested with more than one page, so an Array may be required, etc
  public anyPageCallback: Function = null;

  private userRef: firestore.DocumentReference;
  private userListenerUnsubscribe;

  watchUser(): void {
    if (this.userWrapper.user) {
      this.listenToUserUpdates(this.userWrapper.user.id);
    }
  }

  private listenToUserUpdates(id: string) {
    this.userRef = firebase.firestore.collection("users").doc(id);

    this.userListenerUnsubscribe = this.userRef.onSnapshot(doc => {
      if (doc.exists) {
        this.syncUserData(doc);
        this.anyPageCallback && this.anyPageCallback();
      } else {
        console.log("No such document!");
      }
    });
    return null;
  }

  private syncUserData(doc: firestore.DocumentSnapshot): void {
    const userData = <User>doc.data();
    userData.id = doc.id;
    userData.ref = doc.ref;

    // remember the team (no need to re-fetch)
    const team = this.userWrapper.user.playsinTeam;
    this.userWrapper.user = <User>userData;
    this.userWrapper.user.playsinTeam = team;
  }

  async updateUserDataInFirebase(userData): Promise<void> {
    return this.userRef.update(userData);
  }

  async clearListener() {
    this.userListenerUnsubscribe();
  }
}
