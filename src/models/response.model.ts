import { DATA_TYPE, PARAM } from "./param.model";
import { ChairId, PlayerId } from "./types.model";
import { PlayerData, PlayerFullData } from "./player.model";

export type ResponseType = ResponseModel[];
export type ResponseModel = RMPlayerRegister | RMPlayerChange | RMTableChange | RMChairChange | RMGame | RMGameStart;

// RESPONSE MODELS
export interface RMPlayerRegister {
  [PARAM.DATA_TYPE]: DATA_TYPE.PLAYER_REGISTER;
  [PARAM.DATA]: PlayerFullData
}

export interface RMPlayerChange {
  [PARAM.DATA_TYPE]: DATA_TYPE.PLAYER_CHANGE;
  [PARAM.DATA]: PlayerData;
}

export interface RMTableChange {
  [PARAM.DATA_TYPE]: DATA_TYPE.TABLE_CHANGE;
  [PARAM.DATA]: {
    [PARAM.TABLE_QUEUE]?: PlayerData[];
  };
}

export interface RMChairChange {
  [PARAM.DATA_TYPE]: DATA_TYPE.CHAIR_CHANGE;
  [PARAM.DATA]: {
    [PARAM.CHAIR_ID]: ChairId;
    [PARAM.CHAIR_PLAYER]?: PlayerData;
    [PARAM.CHAIR_PLAYER_IS_READY]?: boolean;
  };
}

export interface RMGame {
  [PARAM.DATA_TYPE]: DATA_TYPE.GAME;
  [PARAM.DATA]: {
    [PARAM.GAME_START]?: boolean;
    [PARAM.GAME_START_TS]?: number;
    [PARAM.GAME_ROUND]?: number;
    [PARAM.GAME_ROUND_ITEMS]?: number[];
  };
}

export interface RMGameStart {
  [PARAM.DATA_TYPE]: DATA_TYPE.GAME_START;
  [PARAM.DATA]: {
    [PARAM.GAME_START]: boolean;
    [PARAM.GAME_START_TS]: number;
    [PARAM.GAME_ROUND]: number;
  };
}



