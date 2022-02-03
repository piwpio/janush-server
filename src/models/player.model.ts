import { PARAM } from "./param.model";

export interface PlayerData {
  [PARAM.NAME]?: string;
}

export const PROPERTY_TO_PARAMP = {
  name: PARAM.NAME
}