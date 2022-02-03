import { PARAM } from "./param.model";

export enum GATEWAY {
  GAME = 'game',
  EXCEPTION = 'exception',
  PLAYER_REGISTER = 'player_register',
  TABLE_SIT = 'table_sit',
  CHAIR_PLAYER_IS_READY = 'chair_player_is_ready',
}

export interface PayloadPlayerRegister {
  [PARAM.PLAYER_NAME]: string
}

export interface PayloadChairPlayerIsReady {
  [PARAM.CHAIR_PLAYER_IS_READY]: boolean
}