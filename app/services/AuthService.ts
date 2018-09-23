// import Vue from 'nativescript-vue'
import BackendService from './BackendService';
import * as firebase from 'nativescript-plugin-firebase';
import { firestore } from "nativescript-plugin-firebase";
import { backendService } from "../main";
import User from "../models/User";
import Player from "../models/Player";

export default class AuthService extends BackendService {

  private playerRef: firestore.DocumentReference;

  async register(user) {
    const createdUser = await firebase.createUser({
      email: user.email,
      password: user.password
    });
    console.log("Created user: " + JSON.stringify(createdUser));
    return await firebase.firestore.add("players", {
      id: createdUser.uid
    });
  }

  async login(fUser) {
    const firebaseUser = await firebase.login({
      type: firebase.LoginType.PASSWORD,
      passwordOptions: {
        email: fUser.email,
        password: fUser.password
      }
    });
    console.log("Logged in user: " + JSON.stringify(firebaseUser));

    const snapshot = await firebase.firestore
        .collection("players")
        .where("id", "==", firebaseUser.uid)
        .get();

    const user = <User>{
      email: firebaseUser.email
    };

    // there will be only 1 record actually
    snapshot.forEach(playerDoc => {
      user.player = <Player>playerDoc.data();
      user.player.id = playerDoc.id;
    });

    console.log("User: " + JSON.stringify(user));

    backendService.user = user;
    return user;
  }

  async updatePlayerDataInFirebase(playerData) {
    // lazy loading
    if (!this.playerRef) {
      this.playerRef = firebase.firestore.collection("players").doc(backendService.user.player.id);
    }
    return this.playerRef.update(playerData);
  }

  async resetPassword(email) {
    const result = await firebase.resetPassword({
      email: email
    });
    return JSON.stringify(result);
  }

  async logout() {
    backendService.user = null;
    return firebase.logout();
  }
}