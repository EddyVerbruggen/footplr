import { firestore } from "nativescript-plugin-firebase";
import Scores from "../shared/Scores";

export type PlayerPosition = "GK" | "CF" | "CAM"; // TODO

export default interface User {
  club: firestore.DocumentReference; // Club
  playsin: firestore.DocumentReference; // Team
  trains: Array<firestore.DocumentReference>; // Array<Team>
  scores?: Scores;
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  admin: boolean;
  birthdate?: Date;
  height?: number;
  weight?: number;
  position?: PlayerPosition;
  picture?: string;
}
