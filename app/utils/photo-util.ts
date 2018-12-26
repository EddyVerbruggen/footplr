import { isIOS } from "tns-core-modules/platform";
import { action } from "tns-core-modules/ui/dialogs";
import { ImageAsset } from "tns-core-modules/image-asset";
import { ImageSource } from "tns-core-modules/image-source";
import * as camera from "nativescript-camera";
import { create as createImagePicker, ImagePickerMediaType } from "nativescript-imagepicker";

export function takeOrPickPhoto(): Promise<ImageAsset | ImageSource> {
  return new Promise<ImageAsset | ImageSource>((resolve, reject) => {
    let currentOptions: Array<string> = [
        "Camera album",
        "Camera"
    ];

    action(
        "Selecteer een afbeelding",
        "Annuleren",
        currentOptions
    ).then((pickedItem: string) => {
      let pickedItemIndex = currentOptions.indexOf(pickedItem);

      if (pickedItemIndex === 0) {
        const imagePicker = createImagePicker({
          minimumNumberOfSelection: 1,
          maximumNumberOfSelection: 1,
          mediaType: ImagePickerMediaType.Image,
          mode: "single"
        });

        imagePicker
            .authorize()
            .then(() => imagePicker.present())
            .then((selection: Array<ImageAsset>) => {
              selection.forEach(asset => {
                asset.options = {
                  // note that these numbers get doubled.. prolly based on screenres
                  width: 500,
                  height: 500,
                  keepAspectRatio: true
                };
                new ImageSource().fromAsset(asset).then(src => resolve(src));
              });
            })
            .catch(e => {
              // ignore, probably canceled
              console.log("imagePicker selection error: " + e);
            });

      } else if (pickedItemIndex === 1) {
        // on iOS this is sync so we can do it here (once)
        if (isIOS) {
          camera.requestPermissions();
        }

        camera.takePicture(
            {
              width: 700,
              height: 700,
              keepAspectRatio: true,
              saveToGallery: false,
              cameraFacing: "rear"
            })
            .then(imageAsset => resolve(imageAsset))
            .catch(e => console.log("camera.takePicture error (user canceled?): " + e));
      }
    });
  });
}
