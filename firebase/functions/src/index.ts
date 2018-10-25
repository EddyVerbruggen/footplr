import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";
import { Measurement } from "./shared/measurement";
import { SharedUser } from "./shared/shared-user";
import { Excercises, Exercise, ExerciseType } from "./shared/exercises";
import Scores from "./shared/scores";

// perhaps it's more efficient to store measurements in the root.. that's probably easier to watch for Firebase: measurements/{measurementId}
exports.onMeasurementWrite = functions.firestore.document("users/{userId}/measurements/{measurementId}").onWrite(async (snap, context) => {

  let measurement: firebase.firestore.DocumentSnapshot;

  // we're ignoring the 'delete' case for now (to support it: find the latest measurement of this exercise (if there is one)
  // TODO implement, as we now support it in the app
  if (!snap.after.exists) {
    const removedMeasurement: firebase.firestore.DocumentSnapshot = snap.before;
    const exercise = (<Measurement>removedMeasurement.data()).exercise;
    const allMeasurementsRef: firebase.firestore.Query = snap.before.ref.parent;
    const querySnapshot = await allMeasurementsRef.where("exercise", "==", exercise).get();
    querySnapshot.forEach(doc => {
      const olderMeasurement = <Measurement>doc.data();
      if (!measurement || (<any>measurement.data().date).toDate().getTime() < (<any>olderMeasurement.date).toDate().getTime()) {
        measurement = doc;
      }
    });

    if (!measurement) {
      // there was no older measurement, so all measurements of this exercise have been deleted
      // TODO update the latest and scores
      return;
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
    user.latestmeasurements = <any>{
      official: {},
      unofficial: {}
    };
  }

  if (!user.scores) {
    user.scores = <any>{
      official: {},
      unofficial: {}
    };
  }

  // find the latest measurement of this exercise
  const latestMeasurements = measurementData.official ? user.latestmeasurements.official : user.latestmeasurements.unofficial;

  // only update if this one is newer than what we have (hardening against edits/migration)
  if (!latestMeasurements[measurementData.exercise] || (<any>latestMeasurements[measurementData.exercise].date).toDate().getTime() <= (<any>measurementData.date).toDate().getTime()) {
    latestMeasurements[measurementData.exercise] = measurementData;

    // now update the scores, based on latestMeasurements
    if (measurementData.official) {
      user.scores.official = calculateScores(latestMeasurements);
    } else {
      user.scores.unofficial = calculateScores(latestMeasurements);
    }

    await userRef.update({
      latestmeasurements: user.latestmeasurements,
      scores: user.scores,
      lastupdate: firebase.firestore.FieldValue.serverTimestamp() // this makes sure the player is updated, so listeners (in the app) get updated
    });
  }

  return null;
});

function calculateScores(measurements: { [t in ExerciseType]: Measurement }): Scores {
  const PAC = Math.round(
      (calculateScore(measurements.STAMINA, Excercises.STAMINA) +
          calculateScore(measurements.DRIBBLE, Excercises.DRIBBLE) +
          calculateScore(measurements.SPEED_OF_ACTION, Excercises.SPEED_OF_ACTION) +
          calculateScore(measurements.EXPLOSIVENESS, Excercises.EXPLOSIVENESS) +
          calculateScore(measurements.SPRINT, Excercises.SPRINT) +
          calculateScore(measurements.HEARTRATE, Excercises.HEARTRATE) +
          calculateScore(measurements.AGILITY, Excercises.AGILITY)) / 7);

  const TEC = Math.round(
      (calculateScore(measurements.SPEED_OF_ACTION, Excercises.SPEED_OF_ACTION) +
          calculateScore(measurements.PASSING_MOVEMENTS, Excercises.PASSING_MOVEMENTS) +
          calculateScore(measurements.AIM, Excercises.AIM) +
          calculateScore(measurements.CONTROL_LOW_BALL, Excercises.CONTROL_LOW_BALL) +
          calculateScore(measurements.CONTROL_HIGH_BALL, Excercises.CONTROL_HIGH_BALL)) / 5);

  const DRI = Math.round(
      calculateScore(measurements.DRIBBLE, Excercises.DRIBBLE));

  const PAS = Math.round(
      (calculateScore(measurements.AGILITY, Excercises.AGILITY) +
          calculateScore(measurements.AIM, Excercises.AIM) +
          calculateScore(measurements.CROSSPASS, Excercises.CROSSPASS)) / 3);

  const PHY = Math.round(
      (calculateScore(measurements.STAMINA, Excercises.STAMINA) +
          calculateScore(measurements.EXPLOSIVENESS, Excercises.EXPLOSIVENESS) +
          calculateScore(measurements.SPRINT, Excercises.SPRINT) +
          calculateScore(measurements.HEARTRATE, Excercises.HEARTRATE) +
          calculateScore(measurements.HEADER_HEIGHT, Excercises.HEADER_HEIGHT) +
          calculateScore(measurements.JUMP_HEIGHT, Excercises.JUMP_HEIGHT) +
          calculateScore(measurements.SIT_UPS, Excercises.SIT_UPS) +
          calculateScore(measurements.PUSH_UPS, Excercises.PUSH_UPS)) / 8);

  const SHO = Math.round(
      (calculateScore(measurements.SHOT_STRENGTH, Excercises.SHOT_STRENGTH) +
          calculateScore(measurements.AIM, Excercises.AIM)) / 2);

  const divideBy =
      (PAC === 0 ? 0 : 1) +
      (TEC === 0 ? 0 : 1) +
      (DRI === 0 ? 0 : 1) +
      (PAS === 0 ? 0 : 1) +
      (PHY === 0 ? 0 : 1) +
      (SHO === 0 ? 0 : 1);

  const TOTAL = Math.round((PAC + TEC + DRI + PAS + PHY + SHO) / divideBy);

  console.log("PAC: " + PAC + ", TEC: " + TEC + ", DRI: " + DRI + ", PAS: " + PAS + ", PHY: " + PHY + ", SHO: " + SHO);

  return {
    PAC,
    TEC,
    DRI,
    PAS,
    PHY,
    SHO,
    TOTAL
  }
}

function calculateScore(measurement: Measurement, exercise: Exercise): number {
  if (!measurement) {
    return 0;
  }
  if (exercise.scoreCalculationType === "LOW_HIGH") {
    return Math.max(100 * (measurement.score - exercise.lowbound) / (exercise.highbound - exercise.lowbound), 0);
  } else if (exercise.scoreCalculationType === "HIGH_LOW") {
    return Math.max(100 * (exercise.highbound - measurement.score) / (exercise.highbound - exercise.lowbound), 0);
  }

  return 0;
}