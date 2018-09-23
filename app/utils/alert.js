import * as dialogsModule from "ui/dialogs";

export default function alert(message) {
    return dialogsModule.alert({
        title: "footplr",
        okButtonText: "OK",
        message: message
    });
}