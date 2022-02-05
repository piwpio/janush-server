import { PARAM } from "./param.model";
import { MOVE_DIRECTION } from "./meple.model";

export enum GATEWAY {
  MAIN = 'main',
  EXCEPTION = 'exception',
  PLAYER_REGISTER = 'player_register',
  TABLE_SIT_TO = 'table_sit_to',
  TABLE_STAND_FROM = 'table_stand_from',
  CHAIR_PLAYER_SET_READY = 'chair_player_set_ready',
  MEPLE_MOVE = 'meple_move',
  MEPLE_COLLECT = 'meple_collect',
}

export interface PayloadPlayerRegister {
  [PARAM.PLAYER_NAME]: string
}

export interface PayloadChairPlayerIsReady {
  [PARAM.CHAIR_PLAYER_IS_READY]: boolean
}

export interface PayloadMepleMove {
  [PARAM.MEPLE_MOVE_DIRECTION]: MOVE_DIRECTION
}