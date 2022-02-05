import { RMepleChange } from "../models/response.model";
import { Response } from "./response.class";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { GENERAL_ID } from "../models/types.model";

export class Meple {
  public readonly id: GENERAL_ID;
  public fieldIndex: number;
  public points = 0;

  constructor(mepleId: GENERAL_ID) {
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