import { Category } from "./category";

export type ScoreType = "SPEED" | "POINTS" | "TIMES" | "TIME";

export class Exercise {
  constructor(public categories: Array<Category>,
              public name: string,
              public description: string,
              public scoretype: ScoreType,
              public factor: number) {
  }
}

export const Exercises = [
  new Exercise(["DRI", "PHY"], "Dribbelen", "Lekker ff een potje dribbelen", "POINTS", 0.57),
  new Exercise(["PAC"], "Hooghouden", "Lekker ff een potje hooghouden", "TIMES", 0.36)
];
