import { getString, remove, setString } from "tns-core-modules/application-settings"
import User from "../models/User";

const userKey = "user";

export default class BackendService {
  isLoggedIn() {
    return !!getString(userKey);
  }

  get user(): User {
    const value = getString(userKey);
    return value ? JSON.parse(value) : null;
  }

  set user(newUser: User) {
    if (newUser) {
      setString(userKey, JSON.stringify(newUser));
    } else {
      remove(userKey);
    }
  }
}