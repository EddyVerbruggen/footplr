import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import { getString } from "tns-core-modules/application-settings";
import { getClub } from "~/services/ClubService";
import { getTeam } from "~/services/TeamService"
import User from "../models/User";
import BackendService from "./BackendService";
import DocumentReference = firestore.DocumentReference;

// this class concerns the logged in user, not the actual user being edited
export default class AuthService extends BackendService {
  public userWrapper: { user: User } = {user: undefined};

  isLoggedIn(): boolean {
    return !!getString(this.userKey);
  }

  async register(email: string, password: string, playsin?: DocumentReference, returnCreatedUser = false) {
    const createdUser = await firebase.createUser({
      email,
      password
    });

    await firebase.firestore.set("users", createdUser.uid, <User>{
      admin: false,
      email,
      playsin,
      // fill these so the orderBy filter of the player dropdown works (it doesn't like undefined values)
      firstname: "",
      lastname: ""
    });

    if (returnCreatedUser) {
      const userDoc = await firebase.firestore.getDocument("users", createdUser.uid);
      const user = <User>userDoc.data();
      user.ref = userDoc.ref;
      user.id = createdUser.uid;
      return user;
    } else {
      return null;
    }
  }

  async getExistingUser(email: string): Promise<User> {
    const querySnapshot: firestore.QuerySnapshot = await firebase.firestore.collection("users")
        .where("email", "==", email)
        .get();

    if (querySnapshot.docs.length === 0) {
      return undefined;
    } else {
      const userDoc = querySnapshot.docs[0];
      const user = <User>userDoc.data();
      user.ref = userDoc.ref;
      user.id = userDoc.id;
      return user;
    }
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
    this.user = user;

    await this.syncUserData(userDoc);

    // this.listenToUserUpdates(firebaseUser.uid);
    return user;
  }

  async refresh() {
    const id = this.user.id;
    const userDoc = await firebase.firestore.getDocument("users", id);
    const user = <User>userDoc.data();
    user.ref = userDoc.ref;
    user.id = id;
    this.user = user;
    await this.syncUserData(userDoc);
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
    user.email = userData.email;
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
      userData.playsInTeam = await getTeam(user.playsin);
      userData.playsInTeam.club = await getClub(user.playsin);
    }

    if (userData.trains) {
      userData.trainsTeams = [];
      for (let trains of userData.trains) {
        const team = await getTeam(trains);
        team.club = await getClub(trains);
        userData.trainsTeams.push(team);
      }
    }

    this.userWrapper.user = <User>userData;
    this.user = user;
    return null;
  }

  async resetPassword(email) {
    const result = await firebase.sendPasswordResetEmail(email);
    return JSON.stringify(result);
  }

  async logout() {
    this.user = null;
    return firebase.logout();
  }
}
