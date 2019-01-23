import { firestore } from "nativescript-plugin-firebase";
import AppInfo from "~/models/app-info";
import Team from "~/models/team";
import { PlayerPosition } from "~/shared/player-position";
import { SharedUser } from "~/shared/shared-user";

export default interface User extends SharedUser {
  ref: firestore.DocumentReference; // self
  club: firestore.DocumentReference; // Club
  playsin?: firestore.DocumentReference; // Team
  trains?: Array<firestore.DocumentReference>; // Array<Team>
  email: string;
  appinfo: AppInfo;
  firstname?: string;
  lastname?: string;
  admin: boolean;
  birthdate?: Date;
  height?: number;
  weight?: number;
  position?: PlayerPosition;
  picture?: string; // URL to Firebase Storage @ 'clublogos'

  // these are fetched in the app, not stored (TODO could extend this class and move this property to it, and use that to make it more clear..)
  playsinTeam?: Team;
}
