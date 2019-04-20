import { isIOS } from "tns-core-modules/platform";
import { ad, ios } from "tns-core-modules/utils/utils";

export function isLandscape(): boolean {
  if (isIOS) {
    return ios.isLandscape();
  } else {
    return 2 === ad.getApplicationContext().getResources().getConfiguration().orientation;
  }
}
