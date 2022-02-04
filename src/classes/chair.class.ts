import { ChairId, PlayerId } from "../models/types.model";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { PlayersService } from "../services/players.service";
import { Response } from "./response.class";
import { RMChairChange } from "../models/response.model";

export class Chair {
  public readonly id: ChairId;
  public playerId: PlayerId = null;
  public isBusy = false;
  public isReady = false;

  constructor(id: ChairId) {
    this.id = id;
  }

  sitDown(playerId: PlayerId, response: Response): void {
    this.isBusy = true;
    this.playerId = playerId;
    response.add(this.getData());
  }

  standUp(response: Response): void {
    this.reset();
    response.add(this.getData());
  }

  setReady(isReady: boolean, response: Response): void {
    this.isReady = isReady;
    response.add(this.getData());
  }

  reset(): void {
    this.playerId = null;
    this.isBusy = false;
    this.isReady = false;
  }

  getData(): RMChairChange {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.CHAIR_CHANGE,
      [PARAM.DATA]: {
        [PARAM.CHAIR_ID]: this.id,
        [PARAM.CHAIR_PLAYER]: this.playerId ? PlayersService.getPlayerById(this.playerId)?.getDataForChair() : null,
        [PARAM.CHAIR_PLAYER_IS_READY]: this.isReady
      }
    }
  }
}