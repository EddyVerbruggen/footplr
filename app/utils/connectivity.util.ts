import { connectionType, getConnectionType } from "tns-core-modules/connectivity";

export default function isOnline(): boolean {
  return getConnectionType() !== connectionType.none;
}
