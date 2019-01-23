import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import Team from "~/models/team";
import User from "~/models/user";

export async function getTeam(teamRef: firestore.DocumentReference): Promise<Team> {
  const teamDoc = await teamRef.get();
  const team = <Team>teamDoc.data();
  team.id = teamDoc.id;
  team.ref = teamDoc.ref;
  return team;
}

export async function getPlayersInTeam(teamRef: firestore.DocumentReference): Promise<Array<User>> {
  // note that this fails during livesync 😔
  const querySnapshot: firestore.QuerySnapshot = await firebase.firestore.collection("users")
      .where("playsin", "==", teamRef)
      .get();

  // also fetching team, so we can set that in the user objects (need that to filter the list of measurements by age group)
  const team = await getTeam(teamRef);

  const users: Array<User> = [];
  querySnapshot.docSnapshots.forEach(userDoc => {
    const user = <User>userDoc.data();
    user.id = userDoc.id;
    user.ref = userDoc.ref;
    user.playsinTeam = team;
    users.push(user);
  });
  return users;
}