import { PARAM } from "./param.model";
import { PlayerId } from "./types.model";

export interface PlayerFullData {
  [PARAM.PLAYER_ID]: PlayerId;
  [PARAM.PLAYER_NAME]: string;
}

export interface PlayerData {
  [PARAM.PLAYER_ID]: PlayerId;
  [PARAM.PLAYER_NAME]?: string;
}