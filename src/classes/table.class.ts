import { PlayerId } from "../models/types.model";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { PlayersService } from "../services/players.service";
import { Response } from "./response.class";
import { Chair } from "./chair.class";
import { GAME_ITEMS_PER_ROUND, GAME_MIN_ROUND_PLAYED_TO_GET_WIN_AFTER_SURRENDER, GAME_ROUNDS, GAME_START_TIMEOUT } from "../config";
import { RMGameEnd, RMGameStart, RMTableChange } from "../models/response.model";
import { CHAIR_ID_1, CHAIR_ID_2 } from "../models/chair.model";

export class Table {
  public chair1: Chair = new Chair(CHAIR_ID_1);
  public chair2: Chair = new Chair(CHAIR_ID_2);
  public queue: PlayerId[] = [];

  // GAME
  private isGameStarted = false;
  private currentRound = 0;
  private roundItems: number[][] = [];
  private gameStartTs = 0;

  sitTo(playerId: PlayerId, response: Response): void {
    if (!this.chair1.isBusy) {
      this.chair1.sitDown(playerId, response)
    } else if (!this.chair2.isBusy) {
      this.chair2.sitDown(playerId, response);
    } else {
      this.addToQueue(playerId, response);
    }
  }

  standFrom(playerId: PlayerId, response: Response) {
    const playerChair = this.getPlayerChair(playerId);

    if (playerChair) {
      playerChair.standUp(response);

      if (this.isGameStarted) {
        if (this.currentRound >= GAME_MIN_ROUND_PLAYED_TO_GET_WIN_AFTER_SURRENDER) {
          const winnerChair = playerChair.id === CHAIR_ID_1 ? this.chair2 : this.chair1;
          winnerChair.setReady(false, response);

          const winnerPlayerId = winnerChair.playerId;
          response.add(this.getEndGameData(winnerPlayerId));
        }

        this.resetGame();
      }

    } else if (this.isPlayerInQueue(playerId)) {
      this.removeFromQueue(playerId, response);
    }
  }

  setPlayerReady(playerId: PlayerId, isReady: boolean, response: Response): void {
    this.getPlayerChair(playerId)?.setReady(isReady, response);

    if (this.chair1.isReady && this.chair2.isReady) {
      this.startGame(response)
    }
  }

  // HELPERS REGION

  isPlayerOnChair(playerId: PlayerId): boolean {
    return !!this.getPlayerChair(playerId);
  }

  isPlayerInQueue(playerId: PlayerId): boolean {
    return this.queue.some(queueUserId => queueUserId === playerId)
  }

  isPlayerReady(playerId: PlayerId): boolean {
    const playerChair = this.getPlayerChair(playerId);
    if (playerChair)
      return playerChair.isReady;
    else
      return false
  }

  private addToQueue(playerId: PlayerId, response: Response): void {
    this.queue.push(playerId)
    response.add(this.getQueueData());
  }

  private removeFromQueue(playerId: PlayerId, response: Response): void {
    const index = this.queue.findIndex(queuePlayerId => queuePlayerId === playerId);
    this.queue.splice(index, 1);
    response.add(this.getQueueData());
  }

  private getPlayerChair(playerId: PlayerId): Chair {
    if (this.chair1.playerId === playerId)
      return this.chair1
    else if (this.chair1.playerId === playerId)
      return this.chair2;

    return null
  }

  private startGame(response: Response): void {
    this.isGameStarted = true;
    this.currentRound = 0;

    // Randomize round items
    const array = Array.from({ length:40 }, (v,k) => k);
    for (let round = 0; round < GAME_ROUNDS; round++) {
      const shuffled = array.sort(() => 0.5 - Math.random());
      this.roundItems[round] = shuffled.slice(0, GAME_ITEMS_PER_ROUND);
    }

    this.gameStartTs = Date.now() + GAME_START_TIMEOUT;
    response.add(this.getNewGameData());
  }

  private resetGame(): void {
    this.isGameStarted = false;
    this.currentRound = 0;
    this.roundItems = [];
    this.gameStartTs = 0;
  }

  // GET DATA REGION

  private getQueueData(): RMTableChange {
    const playersInQueue = [];
    this.queue.forEach(playerId => {
      const playerData = PlayersService.getPlayerById(playerId)?.getDataForQueue();
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

  private getNewGameData(): RMGameStart {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_START,
      [PARAM.DATA]: {
        [PARAM.GAME_START_TS]: this.gameStartTs,
        [PARAM.GAME_ROUND]: this.currentRound
      }
    }
  }

  private getEndGameData(playerWinnerId: PlayerId): RMGameEnd {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_END,
      [PARAM.DATA]: {
        [PARAM.GAME_WINNER]: PlayersService.getPlayerById(playerWinnerId)?.getDataFull()
      }
    }
  }
}