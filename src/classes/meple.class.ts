import { RMepleChange } from "../models/response.model";
import { Response } from "./response.class";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { GENERAL_ID, MOVE_DIRECTION } from "../models/types.model";
import { GAME_FIELDS } from "../config";

export class Meple {
  public readonly id: GENERAL_ID;
  public fieldIndex: number;
  public points = 0;
  public lastActionTs = 0;

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
    this.lastActionTs = 0;
    this.fieldIndex = this.id === GENERAL_ID.ID1 ? 0 : (GAME_FIELDS/2);
    this.addResponse(response);
  }

  setAfterGameEnds(): void {
    this.points = 0;
    this.lastActionTs = 0;
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