import { PARAM } from "./param.model";
import { PlayerId } from "./types.model";

export interface PlayerFullData {
  [PARAM.PLAYER_ID]: PlayerId;
  [PARAM.PLAYER_NAME]: string;
  [PARAM.PLAYER_WINSTREAK]: number;
}

export interface PlayerData {
  [PARAM.PLAYER_ID]: PlayerId;
  [PARAM.PLAYER_NAME]?: string;
  [PARAM.PLAYER_WINSTREAK]?: number;
}