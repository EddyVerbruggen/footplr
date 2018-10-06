import { Category } from "./category";

export enum ExerciseType {
  CONTROL_HIGH_BALL = "CONTROL_HIGH_BALL",
  CONTROL_LOW_BALL = "CONTROL_LOW_BALL",
  AGILITY = "AGILITY",
  CROSSPASS = "CROSSPASS",
  DRIBBLE = "DRIBBLE",
  EXPLOSIVENESS = "EXPLOSIVENESS",
  SPEED_OF_ACTION = "SPEED_OF_ACTION",
  HEARTRATE = "HEARTRATE",
  HEADER_HEIGHT = "HEADER_HEIGHT",
  AIM = "AIM",
  PASSING_MOVEMENTS = "PASSING_MOVEMENTS",
  PUSH_UPS = "PUSH_UPS",
  SHOT_STRENGTH = "SHOT_STRENGTH",
  SIT_UPS = "SIT_UPS",
  SPRINT = "SPRINT",
  JUMP_HEIGHT = "JUMP_HEIGHT",
  STAMINA = "STAMINA",
}

// we don't require proper i18n for the time being, so doing this the poor mans way for now
export function translateExerciseType(input: ExerciseType): string {
  if (input === ExerciseType.CONTROL_HIGH_BALL) return "Aanname hoge bal";
  else if (input === ExerciseType.CONTROL_LOW_BALL) return "Aanname lage bal";
  else if (input === ExerciseType.AGILITY) return "Behendigheid";
  else if (input === ExerciseType.CROSSPASS) return "Crosspass (lange bal)";
  else if (input === ExerciseType.DRIBBLE) return "Dribbelen";
  else if (input === ExerciseType.EXPLOSIVENESS) return "Explosiviteit";
  else if (input === ExerciseType.SPEED_OF_ACTION) return "Handelingssnelheid";
  else if (input === ExerciseType.HEARTRATE) return "Hartslag";
  else if (input === ExerciseType.HEADER_HEIGHT) return "Kopsprong hoogte";
  else if (input === ExerciseType.AIM) return "Mikken";
  else if (input === ExerciseType.PASSING_MOVEMENTS) return "Passeerbewegingen";
  else if (input === ExerciseType.PUSH_UPS) return "Push Ups (opdrukken)";
  else if (input === ExerciseType.SHOT_STRENGTH) return "Schotkracht";
  else if (input === ExerciseType.SIT_UPS) return "Sit Ups";
  else if (input === ExerciseType.SPRINT) return "Sprinten";
  else if (input === ExerciseType.JUMP_HEIGHT) return "Sprongkracht";
  else if (input === ExerciseType.STAMINA) return "Uithoudingsvermogen";
  else {
    console.log(`!!!!!!!!!!!!!!!!!!! no translation found for ExerciseType '${input}'`);
    return input;
  }
}

export function descriptionForExerciseType(input: ExerciseType): string {
  return "De omschrijving voor deze oefening..";
}

// TODO zie table in doc
export type ScoreType = "SPEED" /* km/h */ | "POINTS" | "DISTANCE" | "COUNT" | "TIME" /* seconds */ | "HEIGHT" /* cm */;

export class Exercise {
  constructor(public categories: Array<Category>,
              public scoretype: ScoreType,
              public factor: number,
              public advanced: boolean = false) {
    // TODO consider adding lowbound and highbound (as seen in the table in the doc), and use it for entry validation
  }
}

// TODO factors are dummy
export const Excercises: { [t in ExerciseType]: Exercise } = {
  CONTROL_HIGH_BALL: new Exercise(["TEC"], "POINTS", 0.33),
  CONTROL_LOW_BALL: new Exercise(["TEC"], "DISTANCE", 0.33),
  AGILITY: new Exercise(["PAC"], "TIME", 0.33),
  CROSSPASS: new Exercise(["PAS"], "DISTANCE", 0.33),
  DRIBBLE: new Exercise(["DRI", "PAC"], "TIME", 0.33),
  EXPLOSIVENESS: new Exercise(["PAC", "PHY"], "TIME", 0.33),
  SPEED_OF_ACTION: new Exercise(["PAC", "PAS", "TEC"], "POINTS", 0.33),
  HEARTRATE: new Exercise(["PHY", "PAC"], "COUNT", 0.33),
  HEADER_HEIGHT: new Exercise(["PHY"], "HEIGHT", 0.33),
  AIM: new Exercise(["TEC", "SHO", "PAS"], "POINTS", 0.33, true),
  PASSING_MOVEMENTS: new Exercise(["TEC"], "COUNT", 0.33),
  PUSH_UPS: new Exercise(["PHY"], "COUNT", 0.33),
  SHOT_STRENGTH: new Exercise(["SHO"], "SPEED", 0.33, true),
  SIT_UPS: new Exercise(["PHY"], "COUNT", 0.33),
  SPRINT: new Exercise(["PAC", "PHY"], "TIME", 0.33),
  JUMP_HEIGHT: new Exercise(["PHY"], "HEIGHT", 0.33),
  STAMINA: new Exercise(["PAC", "PHY"], "COUNT", 0.33),
};
