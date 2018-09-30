import User from "~/models/user";

export default interface FirebaseUser {
  id: string;
  email: string;
  user?: User;
}