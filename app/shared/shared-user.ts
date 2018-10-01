import Scores from "./Scores";
import { Measurement } from "./measurement";
import { ExerciseType } from "./exercises";

export interface SharedUser {
  id: string;
  scores?: {
    official: Scores;
    unofficial: Scores;
  };
  latestmeasurements?: {
    official: { [t in ExerciseType]: Measurement };
    unofficial: { [t in ExerciseType]: Measurement };
  };
}
