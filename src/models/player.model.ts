import { PARAM } from "./param.model";

export interface PlayerData {
  [PARAM.PLAYER_NAME]?: string;
}

export const PROPERTY_TO_PARAMP = {
  name: PARAM.PLAYER_NAME
}