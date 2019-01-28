import * as functions from "firebase-functions";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { removeBackgroundFromImageUrl } from "remove.bg";

const gcs = require('@google-cloud/storage')();

exports.removeBg = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket;
  console.log({fileBucket});

  const filePath = object.name;
  console.log({filePath});

  const fileName = path.basename(filePath);
  console.log({fileName});

  const apiKeyFile = require("./remove-bg-apikey.json");
  if (!apiKeyFile || !apiKeyFile.apiKey) {
    console.log("No apikey found");
    return;
  }

  const outputFile = path.join(os.tmpdir(), fileName);
  await removeBackgroundFromImageUrl({
    url: filePath,
    size: "regular",
    apiKey: apiKeyFile.apiKey,
    outputFile
  });

  const bucket = gcs.bucket(fileBucket);
  await bucket.upload(outputFile, {
    destination: filePath
  });

  console.log("uploaded!");

  fs.unlinkSync(outputFile);
  console.log("file deleted!");

  return null;
});
