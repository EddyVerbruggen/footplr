import BackendService from "./BackendService";
import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import User from "../models/User";
import { getString } from "tns-core-modules/application-settings";
import { getTeam } from "~/services/TeamService"

// this class concerns the logged in user, not the actual user being edited
export default class AuthService extends BackendService {
  public userWrapper: { user: User } = {user: undefined};

  isLoggedIn(): boolean {
    return !!getString(this.userKey);
  }

  async register(user) {
    const createdUser = await firebase.createUser({
      email: user.email,
      password: user.password
    });

    return await firebase.firestore.set("users", createdUser.uid, {
      admin: false
    });
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
    user.ref = userDoc.ref;
    user.id = firebaseUser.uid;
    user.email = firebaseUser.email;
    this.user = user;

    await this.syncUserData(userDoc);

    // this.listenToUserUpdates(firebaseUser.uid);
    return user;
  }

  private async syncUserData(doc: firestore.DocumentSnapshot): Promise<void> {
    const userData = <User>doc.data();
    const user = this.user;
    userData.id = doc.id;
    userData.ref = doc.ref;
    user.ref = doc.ref;
    user.id = userData.id;
    user.admin = userData.admin;
    user.birthdate = userData.birthdate;
    user.club = userData.club;
    user.trains = userData.trains;
    user.firstname = userData.firstname;
    user.lastname = userData.lastname;
    user.height = userData.height;
    user.weight = userData.weight;
    user.picture = userData.picture;
    user.position = userData.position;
    user.scores = userData.scores;
    user.playsin = userData.playsin;

    if (userData.playsin) {
      const playsInTeam  = await getTeam(user.playsin);
      userData.playsinTeam = playsInTeam;
      // this.userWrapper.user.playsinTeam = playsInTeam;
      console.log(">> fetched team: " + userData.playsinTeam);
    }

    this.userWrapper.user = <User>userData;
    this.user = user;
    return null;
  }

  async resetPassword(email) {
    const result = await firebase.resetPassword({
      email: email
    });
    return JSON.stringify(result);
  }

  async logout() {
    this.user = null;
    return firebase.logout();
  }
}
