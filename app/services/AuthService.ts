// import Vue from 'nativescript-vue'
import BackendService from './BackendService';
import * as firebase from 'nativescript-plugin-firebase';
import { firestore } from "nativescript-plugin-firebase";
import User from "../models/User";
import Player from "../models/Player";
import { getString } from "tns-core-modules/application-settings";

export default class AuthService extends BackendService {

  public playerWrapper: {player: Player} = { player: undefined };

  private playerRef: firestore.DocumentReference;
  private playerLoginUnsubscribe;

  isLoggedIn() {
    if (!!getString(this.userKey)) {
      // TODO move this out of this function
      this.playerWrapper.player = this.user.player;
      this.listenToPlayerUpdates(this.user.id);
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
    return await firebase.firestore.set("players", createdUser.uid, {});
  }

  async login(fUser) {
    const firebaseUser = await firebase.login({
      type: firebase.LoginType.PASSWORD,
      passwordOptions: {
        email: fUser.email,
        password: fUser.password
      }
    });

    const user = <User>{
      id: firebaseUser.uid,
      email: firebaseUser.email
    };

    this.user = user;

    const playerDoc = await firebase.firestore.getDocument("players", firebaseUser.uid);
    await this.syncPlayerData(playerDoc);

    this.listenToPlayerUpdates(firebaseUser.uid);
    return user;
  }

  private listenToPlayerUpdates(id: string) {
    this.playerRef = firebase.firestore.collection("players").doc(id);

    this.playerLoginUnsubscribe = this.playerRef.onSnapshot(doc => {
      if (doc.exists) {
        this.syncPlayerData(doc);
      } else {
        console.log("No such document!");
      }
    });
    return null;
  }

  private async syncPlayerData(doc: firestore.DocumentSnapshot) {
    console.log("Document data:", JSON.stringify(doc.data()));
    const playerData = doc.data();
    const user = this.user;
    user.player = <Player>playerData;
    const lastScores: firestore.DocumentReference = playerData.lastscores;
    if (lastScores) {
      user.player.lastscoresData = (await lastScores.get()).data();
      playerData.lastscoresData = user.player.lastscoresData;
    }
    this.playerWrapper.player = <Player>playerData;
    this.user = user;
    return null;
  }

  async updatePlayerDataInFirebase(playerData) {
    return this.playerRef.update(playerData);
  }

  async resetPassword(email) {
    const result = await firebase.resetPassword({
      email: email
    });
    return JSON.stringify(result);
  }

  async logout() {
    this.user = null;
    this.playerLoginUnsubscribe();
    return firebase.logout();
  }
}