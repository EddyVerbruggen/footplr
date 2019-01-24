import { TapticEngine } from "nativescript-taptic-engine";

const tapticEngine = new TapticEngine();

// note that this only works on iPhone 7 and up
export function tapticSelection(): void {
  // noinspection JSIgnoredPromiseFromCall
  tapticEngine.selection();
}
