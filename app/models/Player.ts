import { firestore } from "nativescript-plugin-firebase";
import Scores from "./Scores";

interface FirebasePlayer {
  firstname?: string;
  lastname?: string;
  lastscores?: firestore.DocumentReference;
  scores?: Scores;
}

export default interface Player extends FirebasePlayer {
  id: string;
  firstname?: string;
  lastname?: string;
  lastscoresData?: Scores;
}