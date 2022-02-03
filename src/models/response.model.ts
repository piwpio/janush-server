import { DATA_TYPE, PARAM } from "./param.model";
import { PlayerId } from "./types.model";

export type ResponseType = ResponseModel[];
export type ResponseModel = RMPlayer | RMTable;

// RESPONSE MODELS
export interface RMPlayer {
  [PARAM.DATA_TYPE]: DATA_TYPE.PLAYER_CHANGE | DATA_TYPE.PLAYER_REGISTER;
  [PARAM.DATA]: RMPlayerData
}
export interface RMPlayerData {
  [PARAM.PLAYER_ID]: PlayerId;
  [PARAM.PLAYER_NAME]?: string;
}

export interface RMTable {
  [PARAM.DATA_TYPE]: DATA_TYPE.TABLE_CHANGE;
  [PARAM.DATA]: RMTableData
}
export interface RMTableData {
  [PARAM.TABLE_CHAIR_1]?: {
    [PARAM.TABLE_PLAYER]?: RMPlayerData,
    [PARAM.TABLE_PLAYER_IS_READY]?: boolean,
  };
  [PARAM.TABLE_CHAIR_2]?: {
    [PARAM.TABLE_PLAYER]?: RMPlayerData
    [PARAM.TABLE_PLAYER_IS_READY]?: boolean,
  };
  [PARAM.TABLE_QUEUE]?: RMPlayerData[];
  [PARAM.TABLE_MOVE]?: {
    [PARAM.TABLE_CHAIR]: number;
    [PARAM.TABLE_FIELD_INDEX]: number;
  }
}



