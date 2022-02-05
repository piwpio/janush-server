import { DATA_TYPE, PARAM } from "./param.model";
import { PlayerData, PlayerFullData } from "./player.model";
import { CHAIR_ID } from "./chair.model";
import { MEPLE_ID } from "./meple.model";

export type ResponseType = ResponseModel[];
export type ResponseModel =
  RMInitData |
  RMPlayerRegister | RMPlayerUnRegister| RMPlayerChange |
  RMTableChange |
  RMChairChange |
  RMGameCountdown | RMGameStart | RMGameUpdate | RMGameEnd | RMGameMepleCollect |
  RMepleChange;

// RESPONSE MODELS
export interface RMInitData {
  [PARAM.DATA_TYPE]: DATA_TYPE.INIT;
  [PARAM.DATA]: {
    [PARAM.INIT_PLAYERS]: PlayerFullData[]
    [PARAM.INIT_TABLE]: RMTableChange[PARAM.DATA]
    [PARAM.INIT_CHAIRS]: RMChairChange[PARAM.DATA][]
  }
}

export interface RMPlayerRegister {
  [PARAM.DATA_TYPE]: DATA_TYPE.PLAYER_REGISTER;
  [PARAM.DATA]: PlayerFullData
}

export interface RMPlayerUnRegister {
  [PARAM.DATA_TYPE]: DATA_TYPE.PLAYER_UNREGISTER;
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
    [PARAM.CHAIR_ID]: CHAIR_ID;
    [PARAM.CHAIR_PLAYER]?: PlayerData;
    [PARAM.CHAIR_PLAYER_IS_READY]?: boolean;
    [PARAM.CHAIR_POINTS]?: number,
    [PARAM.CHAIR_WINSTREAK]?: number
  };
}

export interface RMGameCountdown {
  [PARAM.DATA_TYPE]: DATA_TYPE.GAME_COUNTDOWN;
  [PARAM.DATA]: {
    [PARAM.GAME_START_TS]: number;
    [PARAM.GAME_FIELDS]: number[];
  };
}

export interface RMGameStart {
  [PARAM.DATA_TYPE]: DATA_TYPE.GAME_START;
  [PARAM.DATA]: {};
}

export interface RMGameUpdate {
  [PARAM.DATA_TYPE]: DATA_TYPE.GAME_UPDATE;
  [PARAM.DATA]: {
    [PARAM.GAME_ROUND]: number;
    [PARAM.GAME_ROUND_ITEMS_IDS]: number[];
    [PARAM.GAME_NEXT_UPDATE_TS]: number[];
  };
}

export interface RMGameEnd {
  [PARAM.DATA_TYPE]: DATA_TYPE.GAME_END;
  [PARAM.DATA]: {
    [PARAM.GAME_WINNER]: PlayerData;
  };
}

export interface RMGameMepleCollect {
  [PARAM.DATA_TYPE]: DATA_TYPE.GAME_MEPLE_COLLECT;
  [PARAM.DATA]: {
    [PARAM.GAME_ROUND_ITEMS_IDS]: number[];
  };
}

export interface RMepleChange {
  [PARAM.DATA_TYPE]: DATA_TYPE.MEPLE_CHANGE;
  [PARAM.DATA]: {
    [PARAM.MEPLE_ID]: MEPLE_ID;
    [PARAM.MEPLE_FIELD_INDEX]: number;
    [PARAM.MEPLE_POINTS]: number;
  };
}



