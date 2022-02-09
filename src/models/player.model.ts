import { PARAM } from "./param.model";
import { PlayerId } from "./types.model";

export type PlayerFullData = Required<PlayerData>;

export interface PlayerData {
  [PARAM.PLAYER_ID]: PlayerId;
  [PARAM.PLAYER_NAME]?: string;
  [PARAM.PLAYER_WINSTREAK]?: number;
  [PARAM.PLAYER_MAX_WINSTREAK]?: number;
  [PARAM.PLAYER_WIN_COUNTER]?: number;
  [PARAM.PLAYER_LOST_COUNTER]?: number;
}