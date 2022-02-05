import { GENERAL_ID, PlayerId } from "../models/types.model";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { PlayersService } from "../services/players.service";
import { Response } from "./response.class";
import { RMChairChange } from "../models/response.model";

export class Chair {
  public readonly id: GENERAL_ID;
  public playerId: PlayerId = null;
  public isBusy = false;
  public isReady = false;
  public points = 0;
  public winStreak = 0;

  constructor(id: GENERAL_ID) {
    this.id = id;
  }

  sitDown(playerId: PlayerId, response: Response): void {
    this.isBusy = true;
    this.playerId = playerId;
    response.add(this.getResponse());
  }

  standUp(response: Response): void {
    this.reset(response);
  }

  setReady(isReady: boolean, response: Response): void {
    this.isReady = isReady;
    response.add(this.getResponse());
  }

  setAfterGameWon(response: Response): void {
    this.isReady = false;
    this.points = 0;
    ++this.winStreak;
    response.add(this.getResponse());
  }

  setAfterGameLost(response: Response): void {
    this.isReady = false;
    this.points = 0;
    this.winStreak = 0;

    response.add(this.getResponse());
  }

  private reset(response: Response): void {
    this.playerId = null;
    this.isBusy = false;
    this.isReady = false;
    this.points = 0;
    this.winStreak = 0;

    response.add(this.getResponse());
  }

  getResponse(): RMChairChange {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.CHAIR_CHANGE,
      [PARAM.DATA]: {
        [PARAM.CHAIR_ID]: this.id,
        [PARAM.CHAIR_PLAYER]:
          this.playerId ? PlayersService.getInstance().getPlayerById(this.playerId)?.getDataForChair() : null,
        [PARAM.CHAIR_PLAYER_IS_READY]: this.isReady,
        [PARAM.CHAIR_POINTS]: this.points,
        [PARAM.CHAIR_WINSTREAK]: this.winStreak
      }
    }
  }
}