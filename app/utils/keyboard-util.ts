import { android as AndroidApp } from "tns-core-modules/application";
import { screen } from "tns-core-modules/platform";
import { View } from "tns-core-modules/ui/core/view";
import { ad } from "tns-core-modules/utils/utils";

declare const android: any;
let lastKeyboardHeight: number;

export function dismissKeyboard(view: View): void {
  if (ad && view.android) {
    ad.dismissSoftInput(view.android);
  }
}

// TODO better to create a class here

let _currentlyActiveElement: View;

export function setCurrentlyActiveElement(view: View): void {
  _currentlyActiveElement = view;
}

export function onAndroidKeyboardShowingListener(callback: (showing: boolean) => void): void {
  if (!ad) {
    return;
  }

  const window = AndroidApp.foregroundActivity.getWindow();
  const decorView = window.getDecorView();

  const _onGlobalLayoutListener = new android.view.ViewTreeObserver.OnGlobalLayoutListener({
    onGlobalLayout(): void {

      const rect = new android.graphics.Rect();
      decorView.getWindowVisibleDisplayFrame(rect);

      const newKeyboardHeight = (getUsableScreenSizeY() - rect.bottom) / screen.mainScreen.scale;

      if (newKeyboardHeight === 0 && lastKeyboardHeight === undefined) {
        return;
      }

      if (newKeyboardHeight === lastKeyboardHeight) {
        return;
      }

      lastKeyboardHeight = newKeyboardHeight;

      if (newKeyboardHeight === 0 && _currentlyActiveElement) {
        console.log("Clearing focus");
        _currentlyActiveElement.android.clearFocus();
      }

      callback(newKeyboardHeight !== 0);
    }
  });

  decorView.getViewTreeObserver().addOnGlobalLayoutListener(_onGlobalLayoutListener);
}

function getUsableScreenSizeY(): number {
  const screenSize = new android.graphics.Point();
  AndroidApp.foregroundActivity.getWindowManager().getDefaultDisplay().getSize(screenSize);
  return screenSize.y;
}
