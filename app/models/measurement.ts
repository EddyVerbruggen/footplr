import { firestore } from "nativescript-plugin-firebase";

export default interface Measurement {
  exercise: firestore.DocumentReference;
  measuredby: firestore.DocumentReference;
  date: Date;
  score: number;
  official: boolean;
}