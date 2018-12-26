import { firestore } from "nativescript-plugin-firebase";
import { SharedUser } from "~/shared/shared-user";

export type PlayerPosition = "GK" | "CF" | "CAM"; // TODO

export default interface User extends SharedUser {
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
  picture?: string; // Firebase Storage URL
}
