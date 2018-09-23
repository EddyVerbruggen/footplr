import { getString, remove, setString } from "tns-core-modules/application-settings"
import User from "../models/User";

export default class BackendService {
  protected userKey = "user";

  get user(): User {
    const value = getString(this.userKey);
    return value ? JSON.parse(value) : null;
  }

  set user(newUser: User) {
    if (newUser) {
      setString(this.userKey, JSON.stringify(newUser));
    } else {
      remove(this.userKey);
    }
  }
}