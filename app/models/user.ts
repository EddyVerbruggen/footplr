import { firestore } from "nativescript-plugin-firebase";
import { PlayerPosition } from "~/shared/player-position";
import { SharedUser } from "~/shared/shared-user";

export default interface User extends SharedUser {
  ref: firestore.DocumentReference; // self
  club: firestore.DocumentReference; // Club
  playsin: firestore.DocumentReference; // Team
  trains: Array<firestore.DocumentReference>; // Array<Team>
  email: string;
  firstname?: string;
  lastname?: string;
  admin: boolean;
  birthdate?: Date;
  height?: number;
  weight?: number;
  position?: PlayerPosition;
  picture?: string; // URL to Firebase Storage @ 'clublogos'
}
