import * as functions from "firebase-functions";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { removeBackgroundFromImageFile } from "remove.bg";
import { apiKey } from "./remove-bg-apikey.json";

const gcs = require('@google-cloud/storage');

export const removeBg = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket;
  console.log({fileBucket});

  const filePath = object.name;
  console.log({filePath});

  const fileName = path.basename(filePath);
  console.log({fileName});

  console.log({apiKey});

  const bucket = gcs().bucket(fileBucket);

  const outputFile = path.join(os.tmpdir(), fileName);

  await bucket.file(filePath).download({
    destination: outputFile
  });

  await removeBackgroundFromImageFile({
    path: outputFile,
    size: "regular",
    apiKey,
    outputFile
  });

  await bucket.upload(outputFile, {
    destination: filePath
  });

  console.log("uploaded!");

  fs.unlinkSync(outputFile);
  console.log("file deleted!");

  return null;
});
