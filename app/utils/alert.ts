import * as dialogsModule from "tns-core-modules/ui/dialogs";

export default function alert(message: string): void {
  // noinspection JSIgnoredPromiseFromCall
  dialogsModule.alert({
    title: "footplr",
    okButtonText: "OK",
    message: message
  });
}