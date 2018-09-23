import Player from "./Player";

export default interface User {
  id: string;
  email: string;
  player: Player;
}