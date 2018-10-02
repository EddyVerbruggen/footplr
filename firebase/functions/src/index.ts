import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";
import { Measurement } from "./shared/measurement";
import { SharedUser } from "./shared/shared-user";
import { Excercises, ExerciseType } from "./shared/exercises";
import Scores from "./shared/scores";

// perhaps it's more efficient to store measurements in the root.. that's probably easier to watch for Firebase: measurements/{measurementId}
exports.onMeasurementWrite = functions.firestore.document("users/{userId}/measurements/{measurementId}").onWrite(async (snap, context) => {

  // we're ignoring the 'delete' case for now (to support it: find the latest measurement of this exercise
  if (!snap.after.exists) {
    return;
  }

  // get the measurement document
  const measurement: firebase.firestore.DocumentSnapshot = snap.after;
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

// TODO the actual calculation ;)
function calculateScores(measurements: { [t in ExerciseType]: Measurement }): Scores {
  const PAC = !measurements.STAMINA ? 0 : Math.round(measurements.STAMINA.score * Excercises.STAMINA.factor);
  const TEC = !measurements.SPEED_OF_ACTION ? 0 : Math.round(measurements.SPEED_OF_ACTION.score * Excercises.SPEED_OF_ACTION.factor);
  const DRI = !measurements.DRIBBLE ? 0 : Math.round(measurements.DRIBBLE.score * Excercises.DRIBBLE.factor);
  const PAS = !measurements.AIM ? 0 : Math.round(measurements.AIM.score * Excercises.AIM.factor);
  const PHY = !measurements.STAMINA ? 0 : Math.round(measurements.STAMINA.score * Excercises.STAMINA.factor);
  const SHO = !measurements.SHOT_STRENGTH ? 0 : Math.round(measurements.SHOT_STRENGTH.score * Excercises.SHOT_STRENGTH.factor);

  const divideBy = (PAC === 0 ? 0 : 1) +
      (TEC === 0 ? 0 : 1) +
      (DRI === 0 ? 0 : 1) +
      (PAS === 0 ? 0 : 1) +
      (PHY === 0 ? 0 : 1) +
      (SHO === 0 ? 0 : 1);

  const TOTAL = Math.round((PAC + TEC + DRI + PAS + PHY + SHO) / divideBy);

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