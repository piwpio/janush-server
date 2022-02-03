import { PlayerId } from "../models/types.model";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { PlayersService } from "../services/players.service";
import { Response } from "./response.class";
import { Chair } from "./chair.class";
import { GAME_ITEMS_PER_ROUND, GAME_ROUNDS, GAME_START_TIMEOUT } from "../config";
import { RMGameStart, RMTableChange } from "../models/response.model";

export class Table {
  public chair1: Chair = new Chair(1);
  public chair2: Chair = new Chair(2);
  public queue: PlayerId[] = [];

  // GAME
  private isGameStarted = false;
  private currentRound = 0;
  private roundItems: number[][] = [];
  private gameStartTs = 0;

  sit(playerId: PlayerId, response: Response): void {
    if (!this.chair1.isBusy) {
      this.chair1.sitOn(playerId, response)
    } else if (!this.chair2.isBusy) {
      this.chair2.sitOn(playerId, response);
    } else {
      this.queue.push(playerId)
      response.add(this.getQueueData());
    }
  }

  playerIsReady(playerId: PlayerId, isReady: boolean, response: Response): void {
    this.chair1.playerId === playerId ?
      this.chair1.setReady(isReady, response) : this.chair2.setReady(isReady, response);

    if (this.chair1.isReady && this.chair2.isReady) {
      this.startGame(response)
    }
  }

  private startGame(response: Response): void {
    this.isGameStarted = true;
    this.currentRound = 0;

    // Randomize round items
    const array = Array.from({ length:40 }, (v,k) => k);
    for (let round = 0; round < GAME_ROUNDS; round++) {
      const shuffled = array.sort(() => 0.5 - Math.random());
      this.roundItems[round] = shuffled.slice(0, GAME_ITEMS_PER_ROUND);
      console.log(this.roundItems[round]);
    }

    this.gameStartTs = Date.now() + GAME_START_TIMEOUT;
    response.add(this.getNewGameData());
  }

  private getQueueData(): RMTableChange {
    const playersInQueue = [];
    this.queue.forEach(playerId => playersInQueue.push(PlayersService.getPlayerById(playerId).getDataForQueue()) );
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.TABLE_CHANGE,
      [PARAM.DATA]: {
        [PARAM.TABLE_QUEUE]: playersInQueue
      }
    };
  }

  private getNewGameData(): RMGameStart {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_START,
      [PARAM.DATA]: {
        [PARAM.GAME_START]: this.isGameStarted,
        [PARAM.GAME_START_TS]: this.gameStartTs,
        [PARAM.GAME_ROUND]: this.currentRound
      }
    }
  }
}