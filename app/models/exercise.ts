import { Category } from "../shared/category";

export type ScoreTypeOLD = "SPEED" | "POINTS" | "TIMES" | "TIME";

export default interface ExerciseOLD {
  categories: Array<Category>;
  name: string;
  description: string;
  scoretype: ScoreTypeOLD;
  factor: number;
}