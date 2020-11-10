import * as firebase from "firebase-admin";
import * as functions from "firebase-functions";
import { Excercises, Exercise } from "./shared/exercises";
import { Measurement } from "./shared/measurement";
import Scores from "./shared/scores";
import { LatestMeasurements, LatestMeasurementsWrapper, ScoresWrapper, SharedUser } from "./shared/shared-user";

// perhaps it's more efficient to store measurements in the root.. that's probably easier to watch for Firebase: measurements/{measurementId}
export const calculateScores = functions.firestore.document("users/{userId}/measurements/{measurementId}").onWrite(async (snap, context) => {
  let measurement: firebase.firestore.DocumentSnapshot;
  let isDeleted = false;
  let allDeleted = false;

  if (!snap.after.exists) {
    isDeleted = true;
    const removedMeasurement: firebase.firestore.DocumentSnapshot = snap.before;
    const exercise = (<Measurement>removedMeasurement.data()).exercise;
    const allMeasurementsRef: firebase.firestore.Query = snap.before.ref.parent;
    const querySnapshot = await allMeasurementsRef.where("exercise", "==", exercise).get();
    querySnapshot.forEach(doc => {
      const olderMeasurement = <Measurement>doc.data();
      if (!measurement || measurement.data().date.getTime() < olderMeasurement.date.getTime()) {
        measurement = doc;
      }
    });

    if (!measurement) {
      allDeleted = true;
      measurement = removedMeasurement;
      // there was no older measurement, so all measurements of this exercise have been deleted
    }

  } else {
    measurement = snap.after;
  }

  const measurementData = <Measurement>measurement.data();

  // find our user
  const userRef: firebase.firestore.DocumentReference = snap.after.ref.parent.parent;
  const user = <SharedUser>(await userRef.get()).data();

  // make sure the data we want to update exists
  if (!user.latestmeasurements) {
    user.latestmeasurements = <LatestMeasurementsWrapper>{
      official: {},
      unofficial: {}
    };
  }

  if (!user.scores) {
    user.scores = <ScoresWrapper>{
      combined: {},
      official: {},
      unofficial: {}
    };
  }

  // find the latest measurement of this exercise
  const latestMeasurements = measurementData.official ? user.latestmeasurements.official : user.latestmeasurements.unofficial;

  // only update if this one is newer than what we have (hardening against edits/migration)
  if (isDeleted || !latestMeasurements[measurementData.exercise] || (<any>latestMeasurements[measurementData.exercise].date).getTime() <= (<any>measurementData.date).getTime()) {
    if (allDeleted) {
      delete latestMeasurements[measurementData.exercise];
    } else {
      latestMeasurements[measurementData.exercise] = measurementData;
    }

    // now update the scores, based on latestMeasurements
    if (measurementData.official) {
      user.scores.official = calc(latestMeasurements);
    } else {
      user.scores.unofficial = calc(latestMeasurements);
    }
    user.scores.combined = calc(getLatestMeasurementsCombined(user.latestmeasurements));

    await userRef.update({
      latestmeasurements: user.latestmeasurements,
      scores: user.scores,
      lastupdate: firebase.firestore.FieldValue.serverTimestamp() // this makes sure the player is updated, so listeners (in the app) get updated
    });
  }

  return null;
});

function getLatestMeasurementsCombined(measurements: LatestMeasurementsWrapper): LatestMeasurements {
  const result = <LatestMeasurements>{};

  for (const k in measurements.official) {
    result[k] = measurements.official[k];
  }

  for (const k in measurements.unofficial) {
    const val = measurements.unofficial[k];
    if (!result[k] || result[k].date.getTime() < val.date.getTime()) {
      result[k] = val;
    }
  }
  return result;
}

function calc(measurements: LatestMeasurements): Scores {
  const PAC = Math.round(
      (calculateScore(measurements.STAMINA, Excercises.STAMINA) +
          calculateScore(measurements.DRIBBLE, Excercises.DRIBBLE) +
          calculateScore(measurements.EXPLOSIVENESS, Excercises.EXPLOSIVENESS) +
          calculateScore(measurements.SPRINT, Excercises.SPRINT) +
          calculateScore(measurements.HEARTRATE, Excercises.HEARTRATE) +
          calculateScore(measurements.AGILITY, Excercises.AGILITY)) /
      Math.max(1,
          (measurements.STAMINA ? 1 : 0) +
          (measurements.DRIBBLE ? 1 : 0) +
          (measurements.EXPLOSIVENESS ? 1 : 0) +
          (measurements.SPRINT ? 1 : 0) +
          (measurements.HEARTRATE ? 1 : 0) +
          (measurements.AGILITY ? 1 : 0)
      )
  );

  const TEC = Math.round(
      (calculateScore(measurements.SPEED_OF_ACTION, Excercises.SPEED_OF_ACTION) +
          calculateScore(measurements.PASSING_MOVEMENTS, Excercises.PASSING_MOVEMENTS) +
          calculateScore(measurements.AIM, Excercises.AIM) +
          calculateScore(measurements.CONTROL_HIGH_BALL, Excercises.CONTROL_HIGH_BALL) +
          calculateScore(measurements.DRIBBLE, Excercises.DRIBBLE)) /
      Math.max(1,
          (measurements.SPEED_OF_ACTION ? 1 : 0) +
          (measurements.PASSING_MOVEMENTS ? 1 : 0) +
          (measurements.AIM ? 1 : 0) +
          (measurements.CONTROL_HIGH_BALL ? 1 : 0) +
          (measurements.DRIBBLE ? 1 : 0)
      )
  );

  const DRI = Math.round(
      calculateScore(measurements.DRIBBLE, Excercises.DRIBBLE));

  const PAS = Math.round(
      (calculateScore(measurements.AIM, Excercises.AIM) +
          calculateScore(measurements.SPEED_OF_ACTION, Excercises.SPEED_OF_ACTION) +
          calculateScore(measurements.CROSSPASS, Excercises.CROSSPASS)) /
      Math.max(1,
          (measurements.AIM ? 1 : 0) +
          (measurements.SPEED_OF_ACTION ? 1 : 0) +
          (measurements.CROSSPASS ? 1 : 0)
      )
  );

  const PHY = Math.round(
      (calculateScore(measurements.STAMINA, Excercises.STAMINA) +
          calculateScore(measurements.EXPLOSIVENESS, Excercises.EXPLOSIVENESS) +
          calculateScore(measurements.SPRINT, Excercises.SPRINT) +
          calculateScore(measurements.HEARTRATE, Excercises.HEARTRATE) +
          calculateScore(measurements.HEADER_HEIGHT, Excercises.HEADER_HEIGHT) +
          calculateScore(measurements.JUMP_HEIGHT, Excercises.JUMP_HEIGHT) +
          calculateScore(measurements.SIT_UPS, Excercises.SIT_UPS) +
          calculateScore(measurements.PUSH_UPS, Excercises.PUSH_UPS)) /
      Math.max(1,
          (measurements.STAMINA ? 1 : 0) +
          (measurements.EXPLOSIVENESS ? 1 : 0) +
          (measurements.SPRINT ? 1 : 0) +
          (measurements.HEARTRATE ? 1 : 0) +
          (measurements.HEADER_HEIGHT ? 1 : 0) +
          (measurements.JUMP_HEIGHT ? 1 : 0) +
          (measurements.SIT_UPS ? 1 : 0) +
          (measurements.PUSH_UPS ? 1 : 0)
      )
  );

  const SHO = Math.round(
      (calculateScore(measurements.SHOT_STRENGTH, Excercises.SHOT_STRENGTH) +
          calculateScore(measurements.AIM, Excercises.AIM)) /
      Math.max(1,
          (measurements.SHOT_STRENGTH ? 1 : 0) +
          (measurements.AIM ? 1 : 0)
      )
  );

  const TOTAL = Math.round((PAC + TEC + DRI + PAS + PHY + SHO) /
      Math.max(1,
          (PAC ? 1 : 0) +
          (TEC ? 1 : 0) +
          (DRI ? 1 : 0) +
          (PAS ? 1 : 0) +
          (PHY ? 1 : 0) +
          (SHO ? 1 : 0)
      )
  );

  return <Scores>{
    PAC,
    TEC,
    DRI,
    PAS,
    PHY,
    SHO,
    TOTAL
  };
}

function calculateScore(measurement: Measurement, exercise: Exercise): number {
  return measurement ? exercise.calculateScore(measurement.measurement) : 0;
}