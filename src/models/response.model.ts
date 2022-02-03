import { DATA_TYPE, PARAM } from "./param.model";

export type ResponseType = ResponseModel[];
export type ResponseModel = RMPlayerChange | any;

// RESPONSE MODELS
export interface RMPlayerChange {
  [PARAM.DATA_TYPE]: DATA_TYPE.PLAYER_CHANGE | DATA_TYPE.REGISTER_PLAYER;
  [PARAM.DATA]: RMPlayerChangeData
}

export interface RMPlayerChangeData {
  [PARAM.PLAYER_ID]: string;
  [PARAM.NAME]?: string;
}



