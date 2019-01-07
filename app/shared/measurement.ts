import { ExerciseType } from "./exercises";

export interface Measurement {
  exercise: ExerciseType;
  date: Date;
  measurement: number;
  score: number;
  official: boolean;
  measuredby: any;
}