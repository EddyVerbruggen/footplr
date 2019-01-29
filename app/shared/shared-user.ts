import Scores from "./Scores";
import { Measurement } from "./measurement";
import { ExerciseType } from "./exercises";

export type LatestMeasurements = { [t in ExerciseType]: Measurement };

export interface LatestMeasurementsWrapper {
  official: LatestMeasurements;
  unofficial: LatestMeasurements;
}

export interface ScoresWrapper {
  combined: Scores;
  official: Scores;
  unofficial: Scores;
}

export interface SharedUser {
  id: string;
  picture?: string; // URL to Firebase Storage @ 'profilepics'
  scores?: ScoresWrapper;
  latestmeasurements?: LatestMeasurementsWrapper;
}
