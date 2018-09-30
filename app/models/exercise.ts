import { Category } from "~/models/category";

export type ScoreType = "SPEED" | "POINTS" | "TIMES" | "TIME";

export default interface Exercise {
  categories: Array<Category>;
  name: string;
  description: string;
  scoretype: ScoreType;
  factor: number;
}