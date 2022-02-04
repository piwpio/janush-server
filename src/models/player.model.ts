import { PARAM } from "./param.model";
import { PlayerId } from "./types.model";

export interface PlayerFullData {
  [PARAM.PLAYER_ID]: PlayerId;
  [PARAM.PLAYER_NAME]: string;
  [PARAM.PLAYER_MAX_WINSTREAK]: number;
  [PARAM.PLAYER_WIN_COUNTER]: number;
  [PARAM.PLAYER_LOST_COUNTER]: number;
}

export interface PlayerData {
  [PARAM.PLAYER_ID]: PlayerId;
  [PARAM.PLAYER_NAME]?: string;
  [PARAM.PLAYER_MAX_WINSTREAK]?: number;
  [PARAM.PLAYER_WIN_COUNTER]?: number;
  [PARAM.PLAYER_LOST_COUNTER]?: number;
}