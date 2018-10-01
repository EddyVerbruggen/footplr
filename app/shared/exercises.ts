import { Category } from "./category";

export enum ExerciseType {
  DRIBBLING = "DRIBBLING",
  JUGGLING = "JUGGLING"
}

export type ScoreType = "SPEED" | "POINTS" | "TIMES" | "TIME";

export class Exercise {
  constructor(public name: string,
              public categories: Array<Category>,
              public description: string,
              public scoretype: ScoreType,
              public factor: number) {
  }
}

export const Excercises: { [t in ExerciseType]: Exercise } = {
  DRIBBLING: new Exercise("Dribbelen", ["DRI", "PHY"], "Lekker ff een potje dribbelen", "POINTS", 0.57),
  JUGGLING: new Exercise("Hooghouden", ["PAC"], "Lekker ff een potje hooghouden", "TIMES", 0.36)
};
