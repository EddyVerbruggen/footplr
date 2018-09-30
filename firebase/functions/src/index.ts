import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";

// perhaps it's more efficient to store measurements in the root.. that's probably easier to watch for Firebase: measurements/{measurementId}
exports.onMeasurementWrite = functions.firestore.document("users/{userId}/measurements/{measurementId}").onWrite((snap, context) => {
  // Get the measurement document
  const measurement: firebase.firestore.DocumentSnapshot = snap.after;
  const measurementData = measurement.data();

  // Find our user
  const user: firebase.firestore.DocumentReference = snap.after.ref.parent.parent;

  /*
  if (!snap.after.exists) {
    // measurement deleted, so recalculate the scores
    // return user.collection("scores").doc(measurement.id).delete().then(() => {
      // if this was the last score, the player reference is now broken.. but now sure 'delete' will be used anyway
    // });

  } else {
    // Calculate the scores
    const scores: any = {
      TOTAL: 95, // this is evenly distributed, so all 6 weigh in for 1/6th
      PAC: calculateMeasurementScore("PAC", measurementData),
      DRI: calculateMeasurementScore("DRI", measurementData),
      SHO: calculateMeasurementScore("SHO", measurementData)
    };

    // create / update
    return player.collection("scores").doc(measurement.id).set(scores).then(() => {
      // create or update the reference
      return player.update({
        lastscores: player.collection("scores").doc(measurement.id),
        lastupdate: firebase.firestore.FieldValue.serverTimestamp() // this makes sure the player is updated, so listeners (in the app) get updated
      });
    });
  }
  */
});

function calculateMeasurementScore(type: any, measurement: any): number {
  if (type === "PAC") {
    return Math.round((measurement.aim + measurement.frequency + measurement.power) / 3);
  } else if (type === "DRI") {
    return 87;
  } else {
    return 60;
  }
}