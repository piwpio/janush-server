import { RMepleChange } from "../models/response.model";
import { Response } from "./response.class";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { GENERAL_ID } from "../models/types.model";
import { GAME_FIELDS } from "../config";

export class Meple {
  public readonly id: GENERAL_ID;
  public fieldIndex: number;
  public points = 0;
  public lastCollectTs = 0;
  public lastMoveTs = 0;

  constructor(mepleId: GENERAL_ID) {
    this.id = mepleId;
    this.fieldIndex = this.id === GENERAL_ID.ID1 ? 0 : (GAME_FIELDS/2);
  }

  collect(points: number, response: Response): void {
    this.points += points
    this.addResponse(response);
  }

  setAfterGameStarts(response: Response): void {
    this.points = 0;
    this.lastCollectTs = 0;
    this.lastMoveTs = 0;
    this.fieldIndex = this.id === GENERAL_ID.ID1 ? 0 : (GAME_FIELDS/2);
    this.addResponse(response);
  }

  setAfterGameEnds(): void {
    this.points = 0;
    this.lastCollectTs = 0;
    this.lastMoveTs = 0;
  }

  addResponse(response: Response): void {
    response.add(this.getResponse());
  }

  getResponse(): RMepleChange {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.MEPLE_CHANGE,
      [PARAM.DATA]: {
        [PARAM.MEPLE_ID]: this.id,
        [PARAM.MEPLE_FIELD_INDEX]: this.fieldIndex,
        [PARAM.MEPLE_POINTS]: this.points
      }
    }
  }
}