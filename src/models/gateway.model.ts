import { PARAM } from "./param.model";

export enum GATEWAY {
  MAIN = 'main',
  EXCEPTION = 'exception',
  PLAYER_REGISTER = 'player_register',
  TABLE_SIT_TO = 'table_sit_down',
  TABLE_STAND_FROM = 'table_stand_up',
  CHAIR_PLAYER_IS_READY = 'chair_player_is_ready',
}

export interface PayloadPlayerRegister {
  [PARAM.PLAYER_NAME]: string
}

export interface PayloadChairPlayerIsReady {
  [PARAM.CHAIR_PLAYER_IS_READY]: boolean
}