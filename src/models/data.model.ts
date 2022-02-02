export enum DATA_KEY {
  REGISTER_PLAYER = '0',
  PLAYER_CHANGE = '1'
}

export enum DATA_PARAM {
  PLAYER_ID = 0,
  DATA = 1,
  NAME = 2
}

// Data received model
export interface DataSModel {
  [DATA_PARAM.PLAYER_ID]?: string;
  [DATA_PARAM.DATA]?: DataSType;
}

export type DataSType = DMRegisterPlayer;

export interface DMRegisterPlayer {
  [DATA_PARAM.NAME]: string;
}
