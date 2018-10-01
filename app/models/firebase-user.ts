import User from "./user";

export default interface FirebaseUser {
  id: string;
  email: string;
  user?: User;
}