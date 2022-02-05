import { MEPLE_ID, MOVE_DIRECTION } from "../models/meple.model";
import { GAME_FIELDS } from "../config";
import { RMepleChange } from "../models/response.model";
import { Response } from "./response.class";
import { DATA_TYPE, PARAM } from "../models/param.model";

export class Meple {
  public readonly id: MEPLE_ID;
  public fieldIndex: number;
  public points = 0;

  constructor(mepleId: MEPLE_ID) {
    this.id = mepleId
  }

  addResponse(response: Response): void {
    response.add({
      [PARAM.DATA_TYPE]: DATA_TYPE.MEPLE_CHANGE,
      [PARAM.DATA]: this.getData()
    })
  }

  getData(): RMepleChange[PARAM.DATA] {
    return {
      [PARAM.MEPLE_ID]: this.id,
      [PARAM.MEPLE_FIELD_INDEX]: this.fieldIndex,
      [PARAM.MEPLE_POINTS]: this.points
    }
  }
}