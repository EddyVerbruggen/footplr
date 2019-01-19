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
  if (input === ExerciseType.CONTROL_HIGH_BALL) return "Balcontrole: Hooghouden";
  else if (input === ExerciseType.CONTROL_LOW_BALL) return "Balcontrole: Aanname";
  else if (input === ExerciseType.AGILITY) return "Wendbaarheid";
  else if (input === ExerciseType.CROSSPASS) return "Crosspass / Lange bal";
  else if (input === ExerciseType.DRIBBLE) return "Dribbel";
  else if (input === ExerciseType.EXPLOSIVENESS) return "Explosiviteit";
  else if (input === ExerciseType.SPEED_OF_ACTION) return "Handelingssnelheid";
  else if (input === ExerciseType.HEARTRATE) return "Herstelvermogen / Hartslag";
  else if (input === ExerciseType.HEADER_HEIGHT) return "Hoogte kopsprong";
  else if (input === ExerciseType.AIM) return "Mikken";
  else if (input === ExerciseType.PASSING_MOVEMENTS) return "Balcontrole: Behendigheid / Skills";
  else if (input === ExerciseType.PUSH_UPS) return "Kracht bovenlichaam / Push-ups";
  else if (input === ExerciseType.SHOT_STRENGTH) return "Schotkracht";
  else if (input === ExerciseType.SIT_UPS) return "Kracht romp / Sit-ups";
  else if (input === ExerciseType.SPRINT) return "Sprintsnelheid";
  else if (input === ExerciseType.JUMP_HEIGHT) return "Kracht bovenbenen: VJT";
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

export type ScoreCalculationType = "LOW_HIGH" | "HIGH_LOW";

export class Exercise {
  constructor(public abbrev: string,
              public categories: Array<Category>,
              public scoretype: ScoreType,
              public scoreCalculationType: ScoreCalculationType,
              public lowbound: number = 0,
              public highbound: number = 0,
              public advanced: boolean = false) {
    // TODO consider adding lowbound and LOW_HIGH (as seen in the table in the doc), and use it for entry validation
    // TODO Factor does not seem to be relevant now, also factor might be different per category the exercise is in.
  }

  calculateScore(measurement?: number): number {
    if (!measurement) {
      return 0;
    }

    if (this.scoreCalculationType === "LOW_HIGH") {
      return Math.min(100, Math.max(100 * (measurement - this.lowbound) / (this.highbound - this.lowbound), 0));
    } else if (this.scoreCalculationType === "HIGH_LOW") {
      return Math.min(100, Math.max(100 * (this.highbound - measurement) / (this.highbound - this.lowbound), 0));
    }

    return 0;
  }
}

// Note that the order here determines what the order is on-screen
export const Excercises: { [t in ExerciseType]: Exercise } = {
  PUSH_UPS: new Exercise("PUSH", ["PHY"], "COUNT","LOW_HIGH", 0,61),
  SIT_UPS: new Exercise("SITU", ["PHY"], "COUNT", "LOW_HIGH",0,55),
  CONTROL_HIGH_BALL: new Exercise("AAHO", ["TEC"], "POINTS", "LOW_HIGH", 0, 130),
  EXPLOSIVENESS: new Exercise("EXPL", ["PAC", "PHY"], "TIME", "HIGH_LOW", 7 ,13),
  SPRINT: new Exercise("SPRI", ["PAC", "PHY"], "TIME", "HIGH_LOW", 4.32, 8.0),
  HEARTRATE: new Exercise("HERS", ["PHY", "PAC"], "COUNT", "LOW_HIGH", 0,45),
  PASSING_MOVEMENTS: new Exercise("TRIC", ["TEC"], "COUNT", "LOW_HIGH",0,20),
  DRIBBLE: new Exercise("DRTE", ["DRI", "PAC"], "TIME", "HIGH_LOW", 8, 25),
  AGILITY: new Exercise("TTES", ["PAC"], "TIME", "HIGH_LOW",8, 14),
  STAMINA: new Exercise("ISRT", ["PAC", "PHY"], "COUNT", "LOW_HIGH",0, 125),
  SHOT_STRENGTH: new Exercise("SCHI", ["SHO"], "SPEED", "LOW_HIGH",0,211, true),
  JUMP_HEIGHT: new Exercise("KOPS", ["PHY"], "HEIGHT","LOW_HIGH", 0, 70),
  CROSSPASS: new Exercise("CRPS", ["PAS"], "DISTANCE", "LOW_HIGH",0, 90),
  AIM: new Exercise("MIKK", ["TEC", "SHO", "PAS"], "POINTS", "LOW_HIGH",0,100, true),
  SPEED_OF_ACTION: new Exercise("HAND", ["PAC", "PAS", "TEC"], "POINTS","LOW_HIGH",0,  100),
  HEADER_HEIGHT: new Exercise("KOPS", ["PHY"], "HEIGHT", "LOW_HIGH", 0,300),
  CONTROL_LOW_BALL: new Exercise("AALO", ["TEC"], "DISTANCE", "HIGH_LOW", 0 ,1200),
};
