import { RMepleChange } from "../models/response.model";
import { Response } from "./response.class";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { GENERAL_ID, MOVE_DIRECTION } from "../models/types.model";
import { GAME_FIELDS } from "../config";

export class Meple {
  public readonly id: GENERAL_ID;
  public fieldIndex: number;
  public points = 0;

  constructor(mepleId: GENERAL_ID) {
    this.id = mepleId;
    this.fieldIndex = this.id === GENERAL_ID.ID1 ? 0 : (GAME_FIELDS/2) - 1;
  }

  move(moveDirection: MOVE_DIRECTION, response: Response): void {
    if (moveDirection === MOVE_DIRECTION.ASC) {
      ++this.fieldIndex;
      if (this.fieldIndex >= GAME_FIELDS) this.fieldIndex = 0;
    } else {
      --this.fieldIndex;
      if (this.fieldIndex < 0) this.fieldIndex = GAME_FIELDS - 1;
    }
    this.addResponse(response);
  }

  collect(points: number, response: Response): void {
    this.points += points
    this.addResponse(response);
  }

  setAfterGameStarts(): void {
    this.points = 0;
    this.fieldIndex = this.id === GENERAL_ID.ID1 ? 0 : (GAME_FIELDS/2) - 1;
  }

  setAfterGameEnds(): void {
    this.points = 0;
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