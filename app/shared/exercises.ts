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

export type ScoreCalculationType = "HIGHBOUND" | "OTHER";

export class Exercise {
  constructor(public abbrev: string,
              public categories: Array<Category>,
              public scoretype: ScoreType,
              public scoreCalculationType: ScoreCalculationType,
              public highbound: number = 0,
              public advanced: boolean = false) {
    // TODO consider adding lowbound and highbound (as seen in the table in the doc), and use it for entry validation
    // TODO Factor does not seem to be relevant now, also factor might be different per category the exercise is in.
  }
}

// TODO factors are dummy
export const Excercises: { [t in ExerciseType]: Exercise } = {
  CONTROL_HIGH_BALL: new Exercise("AAHO", ["TEC"], "POINTS", "HIGHBOUND", 90),
  CONTROL_LOW_BALL: new Exercise("AALO", ["TEC"], "DISTANCE", "OTHER"),
  AGILITY: new Exercise("TTES", ["PAC"], "TIME", "HIGHBOUND",100),
  CROSSPASS: new Exercise("CRPS", ["PAS"], "DISTANCE", "HIGHBOUND",90),
  DRIBBLE: new Exercise("DRTE", ["DRI", "PAC"], "TIME", "OTHER"),
  EXPLOSIVENESS: new Exercise("EXPL", ["PAC", "PHY"], "TIME", "OTHER"),
  SPEED_OF_ACTION: new Exercise("HAND", ["PAC", "PAS", "TEC"], "POINTS","HIGHBOUND", 100),
  HEARTRATE: new Exercise("HERS", ["PHY", "PAC"], "COUNT", "HIGHBOUND",41),
  HEADER_HEIGHT: new Exercise("KOPS", ["PHY"], "HEIGHT", "HIGHBOUND",300),
  AIM: new Exercise("MIKK", ["TEC", "SHO", "PAS"], "POINTS", "HIGHBOUND",100, true),
  PASSING_MOVEMENTS: new Exercise("TRIC", ["TEC"], "COUNT", "HIGHBOUND",20),
  PUSH_UPS: new Exercise("PUSH", ["PHY"], "COUNT","HIGHBOUND", 56),
  SHOT_STRENGTH: new Exercise("SCHI", ["SHO"], "SPEED", "HIGHBOUND",211, true),
  SIT_UPS: new Exercise("SITU", ["PHY"], "COUNT", "HIGHBOUND",49),
  SPRINT: new Exercise("SPRI", ["PAC", "PHY"], "TIME", "OTHER"),
  JUMP_HEIGHT: new Exercise("KOPS", ["PHY"], "HEIGHT","HIGHBOUND", 70),
  STAMINA: new Exercise("ISRT", ["PAC", "PHY"], "COUNT", "HIGHBOUND",125),
};
