import { PlayerId } from "../models/types.model";
import { PARAM } from "../models/param.model";
import { PlayersService } from "../services/players.service";
import { Response } from "./response.class";

export class Table {
  public chair1: PlayerId = null;
  public chair2: PlayerId = null;
  public queue: PlayerId[] = [];

  sit(playerId: PlayerId, response: Response): void {
    if (!this.chair1) {
      this.chair1 = playerId;
      response.addTableDataResponse({
        [PARAM.TABLE_CHAIR_1]: {
          [PARAM.TABLE_PLAYER]: PlayersService.getPlayerById(playerId).getData()
        }
      });

    } else if (!this.chair2) {
      this.chair2 = playerId;
      response.addTableDataResponse({
        [PARAM.TABLE_CHAIR_2]: {
          [PARAM.TABLE_PLAYER]: PlayersService.getPlayerById(playerId).getData()
        }
      });

    } else {
      this.queue.push(playerId)
      const playersInQueue = [];
      this.queue.forEach(playerId => playersInQueue.push(PlayersService.getPlayerById(playerId).getData()) );
      response.addTableDataResponse({ [PARAM.TABLE_QUEUE]: playersInQueue });
    }
  }

  playerReady(playerId: PlayerId, isReady: boolean, response: Response) {
    response.addTableDataResponse({
      [this.chair1 === playerId ? PARAM.TABLE_CHAIR_1 : PARAM.TABLE_CHAIR_2]: {
        [PARAM.TABLE_PLAYER_IS_READY]: true
      }
    })
  }
}