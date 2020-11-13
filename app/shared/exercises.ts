import { Category } from "./category";
import { ScoreType } from "./exercises";

export enum ExerciseType {
  CONTROL_HIGH_BALL = "CONTROL_HIGH_BALL",
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
  else if (input === ExerciseType.AGILITY) return "Wendbaarheid";
  else if (input === ExerciseType.CROSSPASS) return "Crosspass / Lange bal";
  else if (input === ExerciseType.DRIBBLE) return "Dribbel";
  else if (input === ExerciseType.EXPLOSIVENESS) return "Explosiviteit";
  else if (input === ExerciseType.SPEED_OF_ACTION) return "Passing";
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

export function translateExerciseExplanation(input: ExerciseType): string {
  // noinspection Duplicates
  if (input === ExerciseType.CONTROL_HIGH_BALL) return "Plaats 1 voet op de bal. Op het moment dat je de bal in beweging brengt start de tijd.\n\n" +
      "Je krijgt nu 30 seconden om zoveel mogelijk de bal hoog te houden.\n\n" +
      "Let op: Je moet de bal 1 keer met de borst aanraken en 1x met het bovenbeen. Dit mag (hoeft niet) achter elkaar en de volgorde maakt niet uit.\n\n" +
      "Vul het totaal aantal balcontacten in.";
  else if (input === ExerciseType.AGILITY) return "Zet de T-Test uit met 4 pylonen:\n\n" +
      "3 pylonen op 5 meter van elkaar af in de breedte.\n\n" +
      "Op 10 meter van de middelste pylon zet je een 4e pylon in de diepte.\n\n" +
      "Volg de looplijnen van de T-Test zoals in de video en vul de score in. Vergeet niet de pylonen aan te tikken!";
  else if (input === ExerciseType.CROSSPASS) return "Maak een lijn van pylonen waarmee je gemakkelijk de afstand kan bepalen, zoals in de video om de 5 meter een pylon.\n\n" +
      "Dribbel met de bal richting middenstip en pass de bal zo diep mogelijk op deze pylonen-lijn.\n" +
      "Kijk waar de bal stuit en bepaal de diepte.\n" +
      "Kijk dan hoeveel meter de bal naast de pylonen-lijn is gekomen. Trek deze afstand van de diepte af.\n\n" +
      "Pass 3 keer: 2 keer voor het gevoel, 1 keer voor de meting. Alleen de 3e pass telt.";
  else if (input === ExerciseType.DRIBBLE) return "Gebruik de linker- of rechterkant van het strafschopgebied. Probeer het FPR-dribbelparcours zo snel mogelijk af te leggen.\n\n" +
      "Een afgesneden of foutief afgelegde route telt niet.\n\n" +
      "Voer je tijd in.";
  else if (input === ExerciseType.EXPLOSIVENESS) return "Maak vanuit stilstand 1 serie van 5 sprints, heen en weer over de afstand van achterlijn tot de 5-meter lijn.\n\n" +
      "Loop om de pylonen en vul je tijd in.";
  else if (input === ExerciseType.SPEED_OF_ACTION) return "Zet op de achterlijn 10 grote pylonen naast elkaar met tussen elke pylon een klein beetje ruimte.\n\n" +
      "Probeer nu 'vanuit de beweging' de 10 grote pylonen om te schieten vanaf de 16 meter-lijn.\n\n" +
      "Je mag 10 ballen schieten. Hoeveel pylonen schiet je om?";
  else if (input === ExerciseType.HEARTRATE) return "VIA TEST 'UITHOUDINGSVERMOGEN' (ISRT):\n" +
      "Meting 1. Check je hartslag middels een hartslagmeter direct wanneer je uitstapt bij de ISRT.\n\n" +
      "Meting 2. Meet een minuut na meting 1 jouw hartslag middels een hartslagmeter.\n\n\n" +
      "NA EEN REGULIERE TRAINING:\n" +
      "Zorg dat je minimaal 15 minuten actief bent geweest met een normale voetbaltraining.\n\n" +
      "Meting 1. Sprint 30 seconden voluit en check direct je hartslag middels een hartslagmeter. Meet het hoogste punt (je hartslag kan nog iets omhoog gaan).\n\n" +
      "Meting 2. Meet een minuut na meting 1 jouw hartslag middels een hartslagmeter.";
  else if (input === ExerciseType.HEADER_HEIGHT) return "Hoe hoog kom jij voor een kopbal?\n\n" +
      "Meet tot hoe hoog jij een bal kan aanraken. De aanloop en afzet zijn geheel vrij, er wordt tijdens een wedstrijd tenslotte ook op veel verschillende manieren aangelopen en gekopt.";
  else if (input === ExerciseType.AIM) return "Leg 10 ballen ter hoogte van de penaltystip verdeeld over de breedte van het doelgebied.\n\n" +
      "Probeer elke bal in de roos te mikken voor de maximale score van 10 punten per schot. Hoe dichter bij de roos, hoe hoger je score.\n\n" +
      "Tel alle punten bij elkaar op en vul het in.";
  else if (input === ExerciseType.PASSING_MOVEMENTS) return "Probeer binnen 20 seconden zoveel mogelijk passeerbewegingen correct uit te voeren.\n\n" +
      "Voor elke nieuwe correcte beweging krijg je 1 punt. Voor elke beweging die je eerder hebt gedaan in deze test krijg je een half punt. Tel de punten bij elkaar op.\n\n" +
      "Tip: Film de sessie en kijk daarna samen welke bewegingen goed zijn en welke niet en tel alleen de goed uitgevoerde passeerbewegingen.\n\n" +
      "Vul de punten in.";
  else if (input === ExerciseType.PUSH_UPS) return "Plaats je handen op de grond net iets verder uit elkaar dan schouderbreedte, lichaam gestrekt.\n\n" +
      "Zak naar beneden totdat je ellebogen minimaal een hoek van 90 graden hebben bereikt.\n\n" +
      "Duw jezelf weer omhoog, totdat je armen gestrekt zijn.\n\n" +
      "Probeer zoveel mogelijk van deze push-ups uit te voeren.\n\n" +
      "Vul het aantal push-ups in, dat je achter elkaar doet zonder dat je stilvalt of pauzeert.";
  else if (input === ExerciseType.SHOT_STRENGTH) return "Volg de gebruikershandleiding van de snelheidsmeter.\n\n" +
      "Oefen een paar keer voor je echt gaat noteren. Let op techniek en richting, doe niet alles op volle kracht.\n\n" +
      "Wanneer je er klaar voor bent, schiet je 3x zo hard mogelijk de bal met je wreef.\n\n" +
      "Vul het hardste schot in.";
  else if (input === ExerciseType.SIT_UPS) return "Ga met je rug plat op de grond liggen met je knieën gebogen en je voeten plat op de grond.\n\n" +
      "Span je buikspieren aan en kom omhoog.\n\n" +
      "Tik met beide handen je tegelijkertijd je enkels aan en ga weer terug in de startpositie.\n\n" +
      "Herhaal de oefening zonder hulp van anderen.\n\n" +
      "Tel het aantal herhalingen binnen 1 minuut.";
  else if (input === ExerciseType.SPRINT) return "Zet 2 pylonen naast elkaar, waar een speler tussen door kan lopen. Doe dit 35 meter verderop ook.\n\n" +
      "Sprint nu vanuit stilstand de afstand van 35 meter.\n\n" +
      "Vul je tijd in.";
  else if (input === ExerciseType.JUMP_HEIGHT) return "Ga naast een muur of 'VJTester' staan met wat kalk op je vingertoppen.\n\n" +
      "Ga met beide voeten plat op de grond naast elkaar staan en reik nu met je hand zo hoog mogelijk. Tik op het hoogste punt het meetsysteem of de muur aan.\n\n" +
      "Maak nu een sprong recht omhoog en tik op het hoogste punt het meetsysteem of de muur aan.\n\n" +
      "Meet het verschil tussen je eerst punt (in stand) en je tweede punt (met een sprong).\n\n" +
      "Meet 3 sprongen en vul het grootste verschil in.";
  else if (input === ExerciseType.STAMINA) return "Deze meting kun je als je wilt tegelijkertijd met de oefening 'Herstelvermogen' doen.\n\n" +
      "Download het geluidsbestand via de FPR website.\n" +
      "Zet rode pylonen 20 meter uit elkaar.\n" +
      "3 meter binnen beide rode pylonen een gele pylon.\n" +
      "8 meter buiten beide rode pylonen een blauwe pylon.\n\n" +
      "Loop de ISRT volgens de gebruikelijke norm.\n" +
      "Vul het behaald aantal trappen in.";
  else {
    console.log(`!!!!!!!!!!!!!!!!!!! no translation found for ExerciseType '${input}'`);
    return input;
  }
}

export type ScoreType = "SPEED" /* km/h */ | "POINTS" | "DISTANCE" | "COUNT" | "TIME" /* seconds */ | "HEIGHT" /* cm */;

export type ScoreCalculationType = "LOW_HIGH" | "HIGH_LOW";

export class Exercise {
  constructor(public abbrev: string,
              public youTubeId: string,
              public categories: Array<Category>, // TODO can be removed; only relevant for firebase function (which uses its own category mapping)
              public scoretype: ScoreType,
              public scoreCalculationType: ScoreCalculationType,
              public lowbound: number = 0,
              public highbound: number = 0,
              public minumumAgeGroup?: number) {
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

  getScoreUnit(input = true): string {
    if (!input && this.abbrev === "HERS") {
      return "gedaald"
    } else if (this.scoretype === "SPEED") {
      return "km/h";
    } else if (this.scoretype === "POINTS") {
      return "punten"
    } else if (this.scoretype === "DISTANCE") {
      return this.abbrev === "AALA" ? "cm" : "meter";
    } else if (this.scoretype === "COUNT") {
      return input ? "aantal" : "stuks";
    } else if (this.scoretype === "TIME") {
      return "sec"
    } else if (this.scoretype === "HEIGHT") {
      return "cm"
    } else {
      console.log("Unknown scoretype: " + this.scoretype);
      return "";
    }
  }

  isAvailableForAgeGroup(ageGroup?: number): boolean {
    if (!ageGroup || !this.minumumAgeGroup) {
      return true;
    }
    return ageGroup >= this.minumumAgeGroup;
  }
}

// Note that the order here determines what the order is on-screen
export const Excercises: { [t in ExerciseType]: Exercise } = {
  PUSH_UPS: new Exercise("PUSH", "ysrkumUplrI", ["PHY"], "COUNT", "LOW_HIGH", 0, 61, 16),
  SIT_UPS: new Exercise("SITU", "jkKhPD3CaJY", ["PHY"], "COUNT", "LOW_HIGH", 0, 55, 16),
  CONTROL_HIGH_BALL: new Exercise("AAHO", "TsprnAlWTaY", ["TEC"], "POINTS", "LOW_HIGH", 0, 130, 12),
  EXPLOSIVENESS: new Exercise("EXPL", "amv7oiXBvEM", ["PAC", "PHY"], "TIME", "HIGH_LOW", 7, 13),
  SPRINT: new Exercise("SPRI", "Db84D_s4DTI", ["PAC", "PHY"], "TIME", "HIGH_LOW", 4.32, 9.0),
  HEARTRATE: new Exercise("HERS", "C4HMiGbWrbI", ["PHY", "PAC"], "COUNT", "LOW_HIGH", 0, 70, 16),
  PASSING_MOVEMENTS: new Exercise("TRIC", "kbfxpa2t0cI", ["TEC"], "COUNT", "LOW_HIGH", 0, 20, 12),
  DRIBBLE: new Exercise("DRTE", "h9dwN4RlVOs", ["DRI", "PAC"], "TIME", "HIGH_LOW", 8, 25),
  AGILITY: new Exercise("TTES", "g07p-RHL8k8", ["PAC"], "TIME", "HIGH_LOW", 8, 14, 12),
  STAMINA: new Exercise("ISRT", "ghq4rnYyI7Y", ["PAC", "PHY"], "COUNT", "LOW_HIGH", 0, 125, 12),
  SHOT_STRENGTH: new Exercise("SCHI", "3zXxlNIMg0U", ["SHO"], "SPEED", "LOW_HIGH", 0, 150),
  JUMP_HEIGHT: new Exercise("SPRO", "c6_GQvtBxkg", ["PHY"], "HEIGHT", "LOW_HIGH", 0, 77, 16),
  CROSSPASS: new Exercise("CRPS", "mrfqNLH9wgY", ["PAS"], "DISTANCE", "LOW_HIGH", 0, 75, 12),
  AIM: new Exercise("MIKK", "3b3lQMI6nrs", ["TEC", "SHO", "PAS"], "POINTS", "LOW_HIGH", 0, 100),
  SPEED_OF_ACTION: new Exercise("HAND", "0GLP93V3-wA", ["PAS", "TEC"], "POINTS", "LOW_HIGH", 0, 10),
  HEADER_HEIGHT: new Exercise("KOPS", "UCLf4CKyGHM", ["PHY"], "HEIGHT", "LOW_HIGH", 0, 300)
};
