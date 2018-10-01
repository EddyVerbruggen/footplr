import { ExerciseType } from "./exercises";

export interface Measurement {
  measuredby?: any; // docRef
  exercise: ExerciseType;
  date: Date;
  score: number;
  official: boolean;
}