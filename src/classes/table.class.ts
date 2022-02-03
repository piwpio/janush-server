import { PlayerId } from "../models/types.model";
import { PARAM } from "../models/param.model";
import { PlayersService } from "../services/players.service";
import { Response } from "./response.class";
import { Chair } from "./chair.class";
import { RMPlayerData } from "../models/response.model";

export class Table {
  public chair1: Chair = new Chair(1);
  public chair2: Chair = new Chair(2);
  public queue: PlayerId[] = [];

  sit(playerId: PlayerId, response: Response): void {
    if (!this.chair1.isBusy) {
      this.chair1.sitOn(playerId, response)
    } else if (!this.chair2.isBusy) {
      this.chair1.sitOn(playerId, response);
    } else {
      this.queue.push(playerId)
      response.addTableDataResponse(this.getQueueData());
    }
  }

  getQueueData(): { [PARAM.TABLE_QUEUE]: RMPlayerData[] } {
    const playersInQueue = [];
    this.queue.forEach(playerId => playersInQueue.push(PlayersService.getPlayerById(playerId).getData()) );
    return { [PARAM.TABLE_QUEUE]: playersInQueue };
  }
}