import { DATA_TYPE, PARAM } from "./param.model";
import { ChairId, PlayerId } from "./types.model";

export type ResponseType = ResponseModel[];
export type ResponseModel = RMPlayer | RMTable | RMChair;

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
  [PARAM.TABLE_CHAIR_1]?: RMChairData;
  [PARAM.TABLE_CHAIR_2]?: RMChairData;
  [PARAM.TABLE_QUEUE]?: RMPlayerData[];
  [PARAM.TABLE_MOVE]?: {
    [PARAM.TABLE_CHAIR]: number;
    [PARAM.TABLE_FIELD_INDEX]: number;
  }
}

export interface RMChair {
  [PARAM.DATA_TYPE]: DATA_TYPE.CHAIR_CHANGE;
  [PARAM.DATA]: RMChairData
}
export interface RMChairData {
  [PARAM.CHAIR_ID]: ChairId,
  [PARAM.CHAIR_PLAYER]?: RMPlayerData,
  [PARAM.CHAIR_PLAYER_IS_READY]?: boolean,
}



