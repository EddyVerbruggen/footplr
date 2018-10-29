import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import User from "~/models/user";

export async function getPlayersInTeam(team: firestore.DocumentReference): Promise<Array<User>> {
  const querySnapshot: firestore.QuerySnapshot = await firebase.firestore.collection("users")
      .where("playsin", "==", team)
      .get();

  const users: Array<User> = [];
  querySnapshot.docSnapshots.forEach(userDoc => {
    users.push(<User>userDoc.data());
  });
  return users;
}