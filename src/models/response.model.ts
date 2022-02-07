import { DATA_TYPE, PARAM } from "./param.model";
import { PlayerData, PlayerFullData } from "./player.model";
import { GENERAL_ID } from "./types.model";

export type ResponseType = ResponseModel[];
export type ResponseModel =
  RMPlayerRegister | RMPlayerUnRegister| RMPlayerChange |
  RMTableChange |
  RMChairChange |
  RMGameInit | RMGameUpdate | RMGameEnd | RMGameMepleCollect |
  RMepleChange;

export type ResponseDataType = ResponseDataModel[];
export type ResponseDataModel =
  PlayerFullData | PlayerData |
  RMTableChangeData |
  RMChairChangeData |
  RMGameInitData | RMGameUpdateData | RMGameEndData | RMGameMepleCollectData |
  RMepleChangeData;

// RESPONSE MODELS
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
  [PARAM.DATA]: RMTableChangeData;
}
export interface RMTableChangeData {
  [PARAM.TABLE_QUEUE]?: PlayerData[];
}

export interface RMChairChange {
  [PARAM.DATA_TYPE]: DATA_TYPE.CHAIR_CHANGE;
  [PARAM.DATA]: RMChairChangeData;
}
export interface RMChairChangeData {
  [PARAM.CHAIR_ID]: GENERAL_ID;
  [PARAM.CHAIR_PLAYER]: PlayerData | null;
  [PARAM.CHAIR_PLAYER_IS_READY]: boolean;
}

export interface RMGameInit {
  [PARAM.DATA_TYPE]: DATA_TYPE.GAME_INIT;
  [PARAM.DATA]: RMGameInitData;
}
export interface RMGameInitData {
  [PARAM.GAME_START_TS]: number;
  [PARAM.GAME_IS_ON]: boolean;
  [PARAM.GAME_FIELDS]: number[];
  [PARAM.GAME_PLAYERS]: PlayerData[];
}

export interface RMGameUpdate {
  [PARAM.DATA_TYPE]: DATA_TYPE.GAME_UPDATE;
  [PARAM.DATA]: RMGameUpdateData;
}
export interface RMGameUpdateData {
  [PARAM.GAME_ROUND]: number;
  [PARAM.GAME_ROUND_ITEMS]: number[];
  [PARAM.GAME_NEXT_UPDATE_TS]: number[];
}

export interface RMGameEnd {
  [PARAM.DATA_TYPE]: DATA_TYPE.GAME_END;
  [PARAM.DATA]: RMGameEndData;
}
export interface RMGameEndData {
  [PARAM.GAME_WINNER]: PlayerData | null;
  [PARAM.GAME_LOSER]: PlayerData | null;
  [PARAM.GAME_WINNER_SCORE]: number | null;
  [PARAM.GAME_LOSER_SCORE]: number | null;
}

export interface RMGameMepleCollect {
  [PARAM.DATA_TYPE]: DATA_TYPE.GAME_MEPLE_COLLECT;
  [PARAM.DATA]: RMGameMepleCollectData;
}
export interface RMGameMepleCollectData {
  [PARAM.GAME_ROUND_ITEMS]: number[];
}

export interface RMepleChange {
  [PARAM.DATA_TYPE]: DATA_TYPE.MEPLE_CHANGE;
  [PARAM.DATA]: RMepleChangeData;
}
export interface RMepleChangeData {
  [PARAM.MEPLE_ID]: GENERAL_ID;
  [PARAM.MEPLE_FIELD_INDEX]: number;
  [PARAM.MEPLE_POINTS]: number;
}



