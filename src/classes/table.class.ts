import { PlayerId } from "../models/types.model";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { PlayersService } from "../services/players.service";
import { Response } from "./response.class"
import { RMTableChange } from "../models/response.model";

export class Table {
  public queue: PlayerId[] = [];

  getFirstFromQueue(response: Response): PlayerId {
    const first = this.queue.pop();
    response.add(this.getResponse());
    return first;
  }

  isPlayerInQueue(playerId: PlayerId): boolean {
    return this.queue.some(queueUserId => queueUserId === playerId)
  }

  addToQueue(playerId: PlayerId, response: Response): void {
    this.queue.push(playerId)
    response.add(this.getResponse());
  }

  removeFromQueue(playerId: PlayerId, response: Response): void {
    const index = this.queue.findIndex(queuePlayerId => queuePlayerId === playerId);
    this.queue.splice(index, 1);
    response.add(this.getResponse());
  }

  getResponse(): RMTableChange {
    const playersInQueue = [];
    this.queue.forEach(playerId => {
      const playerData = PlayersService.getInstance().getPlayerById(playerId)?.getDataForQueue();
      if (playerData) {
        playersInQueue.push(playerData);
      }
    });
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.TABLE_CHANGE,
      [PARAM.DATA]: {
        [PARAM.TABLE_QUEUE]: playersInQueue
      }
    };
  }
}