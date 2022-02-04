import { Response } from "./response.class";
import { GAME_ITEMS_PER_ROUND, GAME_ROUND_TIME, GAME_ROUNDS, GAME_START_TIMEOUT } from "../config";
import { RMGameCountdown, RMGameEnd, RMGameStart, RMGameUpdate } from "../models/response.model";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { PlayersService } from "../services/players.service";
import { ChairsService } from "../services/chairs.service";
import { CHAIR_ID } from "../models/chair.model";
import { PlayerFullData } from "../models/player.model";
import { TableService } from "../services/table.service";

export class Game {
  public isGameTimeoutStarted = false;
  public isGameStarted = false;
  public currentRound = -1;
  private gameItems: number[][] = [];
  private gameStartTs = 0;
  private timeoutId = null;
  private nextUpdateTs = null;

  startGameTimeout(response: Response): void {
    this.randomizeGameItems();
    this.isGameTimeoutStarted = true;
    this.currentRound = -1;
    this.gameStartTs = Date.now() + GAME_START_TIMEOUT;

    this.timeoutId = setTimeout(() => this.startGame(), GAME_START_TIMEOUT)

    response.add(this.getGameCountdownResponse());
  }

  private startGame(): void {
    const response = new Response();
    this.isGameStarted = true;

    response.add(this.getGameStartResponse());
    response.broadcast();

    this.gameUpdate();
  }

  private gameUpdate(): void {
    ++this.currentRound;
    if (this.currentRound < GAME_ROUNDS) {
      this.updateRound();
    } else {
      this.endGame();
    }
  }

  private updateRound(): void {
    const response = new Response();
    this.nextUpdateTs = Date.now();
    response.add(this.getGameUpdateResponse());
    response.broadcast();
    this.timeoutId = setTimeout(() => this.gameUpdate(), GAME_ROUND_TIME);
  }

  private endGame(): void {
    const response = new Response();
    const chairsService = ChairsService.getInstance();
    const playersService = PlayersService.getInstance();
    const table = TableService.getInstance().getTable();

    const chair1 = chairsService.getChair(CHAIR_ID.ID1);
    const chair2 = chairsService.getChair(CHAIR_ID.ID2);
    let winnerPlayerData = null;

    if (chair1.points !== chair2.points || table.queue.length < 2) {
      let winnerPlayerChair;
      if (chair1.points !== chair2.points)
        winnerPlayerChair = chair1.points > chair2.points ? chair1 : chair2;
      else
        winnerPlayerChair = !!Math.round(Math.random()) ? chair1 : chair2;

      const loserPlayerChair = chairsService.getOppositeChair(winnerPlayerChair);
      winnerPlayerChair.setAfterGameWon(response);

      const winnerPlayer = playersService.getPlayerById(winnerPlayerChair.playerId);
      const loserPlayer = playersService.getPlayerById(loserPlayerChair.playerId);
      winnerPlayer.setAfterGameWon(winnerPlayerChair.winStreak, response);
      loserPlayer.setAfterGameLost(response);

      const nextPlayerId = table.getFirstFromQueue(response);
      if (nextPlayerId) {
        loserPlayerChair.standUp(response);
        loserPlayerChair.sitDown(nextPlayerId, response);
      } else {
        loserPlayerChair.setAfterGameLost(response);
      }

      winnerPlayerData = winnerPlayer.getDataForEndGame();

    } else {
      // Do domu obydwaj wypierdalać już!
      chair1.standUp(response);
      chair2.standUp(response);
      chair1.sitDown(table.getFirstFromQueue(response), response);
      chair2.sitDown(table.getFirstFromQueue(response), response);
    }

    response.add(this.getEndGameResponse(winnerPlayerData));

    this.resetGame();
  }

  resetGame(): void {
    clearTimeout(this.timeoutId);

    this.isGameTimeoutStarted = false;
    this.isGameStarted = false;
    this.currentRound = -1;
    this.gameItems = [];
    this.gameStartTs = 0;
    this.timeoutId = null;
    this.nextUpdateTs = null;
  }

  private randomizeGameItems(): void {
    const array = Array.from({ length:40 }, (v,k) => k);
    for (let round = 0; round < GAME_ROUNDS; round++) {
      const shuffled = array.sort(() => 0.5 - Math.random());
      this.gameItems[round] = shuffled.slice(0, GAME_ITEMS_PER_ROUND);
    }
  }

  private getGameCountdownResponse(): RMGameCountdown {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_COUNTDOWN,
      [PARAM.DATA]: {
        [PARAM.GAME_START_TS]: this.gameStartTs
      }
    }
  }

  private getGameStartResponse(): RMGameStart {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_START,
      [PARAM.DATA]: {}
    }
  }

  private getGameUpdateResponse(): RMGameUpdate {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_UPDATE,
      [PARAM.DATA]: {
        [PARAM.GAME_ROUND]: this.currentRound,
        [PARAM.GAME_ROUND_ITEMS_IDS]: this.gameItems[this.currentRound],
        [PARAM.GAME_NEXT_UPDATE_TS]: this.nextUpdateTs
      }
    }
  }

  getEndGameResponse(winnerPlayerData: PlayerFullData = null): RMGameEnd {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_END,
      [PARAM.DATA]: {
        [PARAM.GAME_WINNER]: winnerPlayerData
        // [PARAM.GAME_WINNER]: PlayersService.getInstance().getPlayerById(playerWinnerId)?.getDataFull()
      }
    }
  }
}