import { ChairId, PlayerId } from "../models/types.model";
import { PARAM } from "../models/param.model";
import { PlayersService } from "../services/players.service";
import { RMChairData } from "../models/response.model";
import { Response } from "./response.class";

export class Chair {
  private readonly id: ChairId;
  public playerId: PlayerId = null;
  public isBusy = false;
  public isReady = false;

  constructor(id: ChairId) {
    this.id = id;
  }

  sitOn(playerId: PlayerId, response: Response): void {
    this.playerId = playerId;
    this.isBusy = true;
    response.addChairDataToResponse(this.getData());
  }

  standUp(response: Response): void {
    this.reset();
    response.addChairDataToResponse(this.getData());
  }

  setReady(isReady: boolean, response: Response): void {
    this.isReady = isReady;
    response.addChairDataToResponse(this.getData());
  }

  reset(): void {
    this.playerId = null;
    this.isBusy = false;
    this.isReady = false;
  }

  getData(): RMChairData {
    return {
      [PARAM.CHAIR_ID]: this.id,
      [PARAM.CHAIR_PLAYER]: PlayersService.getPlayerById(this.playerId).getData(),
      [PARAM.CHAIR_PLAYER_IS_READY]: this.isReady
    }
  }
}