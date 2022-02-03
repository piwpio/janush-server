import { PARAM } from "./param.model";

export enum GATEWAY {
  GAME = 'game',
  EXCEPTION = 'exception',
  PLAYER_REGISTER = 'player_register',
  TABLE_SIT = 'table_sit',
  TABLE_PLAYER_IS_READY = 'table_player_is_ready',
}

export interface PayloadPlayerRegister {
  [PARAM.PLAYER_NAME]: string
}

export interface PayloadTablePlayerIsReady {
  [PARAM.TABLE_PLAYER_IS_READY]: boolean
}