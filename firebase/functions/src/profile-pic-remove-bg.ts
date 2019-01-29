import { Storage } from "@google-cloud/storage";
import * as firebase from "firebase-admin";
import * as functions from "firebase-functions";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { removeBackgroundFromImageFile } from "remove.bg";
import { apiKey } from "./remove-bg-apikey.json";
import { SharedUser } from "./shared/shared-user";

export const removeBg = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const fileName = path.basename(filePath);

  // the app saves the file as '<user.id>.jpg', and this script saves it as '<user.id>.png', so if it's a png: skip!
  const indexOfJpgExt = fileName.lastIndexOf(".jpg");
  if (indexOfJpgExt === -1) {
    return null;
  }

  const userId = fileName.substring(0, indexOfJpgExt);
  console.log({userId});

  const bucket = new Storage({
    projectId: "foorball-player-ratings"
  }).bucket(fileBucket);

  const outputFile = path.join(os.tmpdir(), fileName);

  await bucket.file(filePath).download({
    destination: outputFile
  });

  // we're currently out of credits, so let's wait a little
  const removeBgEnabled = false;

  if (removeBgEnabled) {
    try {
      await removeBackgroundFromImageFile({
        path: outputFile,
        size: "regular",
        apiKey,
        outputFile
      });

      // removing the background worked, and it's now a .png file
      await bucket.upload(outputFile, {
        destination: outputFile.replace(".jpg", ".png"),
        contentType: "image/png"
      });

      // now that we've updated the image (and its name), update the related user as well
      firebase.initializeApp();
      const userRef = await firebase.firestore().doc(`users/${userId}`);
      const user = <SharedUser>(await userRef.get()).data();

      await userRef.update({
        picture: user.picture.replace(".jpg", ".png"),
        lastupdate: firebase.firestore.FieldValue.serverTimestamp() // this makes sure the player is updated, so listeners (in the app) get updated
      });

    } catch (e) {
      console.log(e);
      return null;
    }
  }

  fs.unlinkSync(outputFile);

  return null;
});
