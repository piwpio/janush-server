import { PARAM } from "./param.model";

export enum GATEWAY {
  GAME = 'game',
  REGISTER_PLAYER = 'register_player'
}

export interface PayloadRegisterPlayer {
  [PARAM.NAME]: string
}