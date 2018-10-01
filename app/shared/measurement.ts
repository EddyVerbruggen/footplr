import { Exercise } from "./exercises";

export default interface Measurement {
  measuredby: any; // docRef
  exercise: Exercise;
  date: Date;
  score: number;
  official: boolean;
}