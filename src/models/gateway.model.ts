import { PARAM } from "./param.model";
import { MOVE_DIRECTION } from "./types.model";

export enum GATEWAY {
  MAIN = '0',
  EXCEPTION = '1',
  PLAYER_REGISTER = '2',
  TABLE_SIT_TO = '3',
  TABLE_STAND_FROM = '4',
  CHAIR_PLAYER_SET_READY = '5',
  MEPLE_MOVE = '6',
  MEPLE_COLLECT = '7',
}

// export enum GATEWAY {
//   MAIN = 'main',
//   EXCEPTION = 'exception',
//   PLAYER_REGISTER = 'player_register',
//   TABLE_SIT_TO = 'table_sit_to',
//   TABLE_STAND_FROM = 'table_stand_from',
//   CHAIR_PLAYER_SET_READY = 'chair_player_set_ready',
//   MEPLE_MOVE = 'meple_move',
//   MEPLE_COLLECT = 'meple_collect',
// }

export interface PayloadPlayerRegister {
  [PARAM.PLAYER_NAME]: string
}

export interface PayloadChairPlayerIsReady {
  [PARAM.CHAIR_PLAYER_IS_READY]: boolean
}

export interface PayloadMepleMove {
  [PARAM.MEPLE_MOVE_DIRECTION]: MOVE_DIRECTION
}