import { Response } from "./response.class";
import { GAME_FIELDS, GAME_ITEMS_PER_ROUND, GAME_ROUND_TIME, GAME_ROUNDS, GAME_START_COUNTDOWN } from "../config";
import { RMGameStart, RMGameEnd, RMGameUpdate } from "../models/response.model";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { PlayersService } from "../services/players.service";
import { ChairsService } from "../services/chairs.service";
import { PlayerFullData } from "../models/player.model";
import { TableService } from "../services/table.service";
import { GENERAL_ID } from "../models/types.model";
import { MeplesService } from "../services/meples.service";
import { Meple } from "./meple.class";

export class Game {
  public isGameStarted = false;

  public currentRound = 0;
  public roundItems: number[][] = [];
  private gameFields: number[] = [];
  private gameStartTs = 0;
  private timeoutId = null;
  private nextUpdateTs = null;

  startGameTimeout(response: Response): void {
    this.isGameStarted = true;

    this.randomizeGameVariables();
    this.currentRound = 0;
    this.gameStartTs = Date.now() + GAME_START_COUNTDOWN;
    this.timeoutId = setTimeout(() => this.startGame(), GAME_START_COUNTDOWN)

    response.add(this.getGameStartResponse());
  }

  private startGame(): void {
    this.gameUpdate();
  }

  private gameUpdate(): void {
    if (this.currentRound < GAME_ROUNDS) {
      this.updateRound();
    } else {
      this.gameEnd();
    }
  }

  private updateRound(): void {
    this.nextUpdateTs = Date.now();

    const response = new Response();
    response.add(this.getGameUpdateResponse());
    response.broadcast();

    ++this.currentRound;
    this.timeoutId = setTimeout(() => this.gameUpdate(), GAME_ROUND_TIME);
  }

  private gameEnd(): void {
    const response = new Response();
    const chairsService = ChairsService.getInstance();
    const playersService = PlayersService.getInstance();
    const meplesService = MeplesService.getInstance();
    const table = TableService.getInstance().getTable();

    const chair1 = chairsService.getChair(GENERAL_ID.ID1);
    const meple1 = meplesService.getMeple(GENERAL_ID.ID1);
    const chair2 = chairsService.getChair(GENERAL_ID.ID2);
    const meple2 = meplesService.getMeple(GENERAL_ID.ID2);

    let winnerPlayerData = null;

    if (meple1.points !== meple2.points || table.queue.length < 2) {
      let winnerMeple: Meple;
      if (meple1.points !== meple2.points)  winnerMeple = meple1.points > meple2.points ? meple1 : meple2;
      else                                  winnerMeple = !!Math.round(Math.random()) ? meple1 : meple2;

      const winnerPlayerChair = chairsService.getChair(winnerMeple.id);
      const loserPlayerChair = chairsService.getOppositeChair(winnerPlayerChair);

      winnerPlayerChair.setAfterGame(response);
      loserPlayerChair.setAfterGame(response);

      const winnerPlayer = playersService.getPlayerById(winnerPlayerChair.playerId);
      const loserPlayer = playersService.getPlayerById(loserPlayerChair.playerId);
      winnerPlayer.setAfterGameWon(response);
      loserPlayer.setAfterGameLost(response);

      const nextPlayerId = table.getFirstFromQueue(response);
      if (nextPlayerId) {
        loserPlayerChair.standUp(response);
        loserPlayerChair.sitDown(nextPlayerId, response);
      }

      meple1.setAfterGameEnds();
      meple2.setAfterGameEnds();

      winnerPlayerData = winnerPlayer.getDataForEndGame();

    } else {
      // Do domu obydwaj wypierdalać już!
      chair1.standUp(response);
      chair2.standUp(response);
      chair1.sitDown(table.getFirstFromQueue(response), response);
      chair2.sitDown(table.getFirstFromQueue(response), response);
      meple1.setAfterGameEnds();
      meple2.setAfterGameEnds();
    }

    response.add(this.getEndGameResponse(winnerPlayerData));
    response.broadcast();

    this.resetGame();
  }

  resetGame(): void {
    clearTimeout(this.timeoutId);

    this.isGameStarted = false;
    this.currentRound = 0;
    this.roundItems = [];
    this.gameFields = [];
    this.gameStartTs = 0;
    this.timeoutId = null;
    this.nextUpdateTs = null;
  }

  private randomizeGameVariables(): void {
    const array = Array.from({ length: GAME_FIELDS }, (v,k) => k);
    this.gameFields = array.sort(() => 0.5 - Math.random());

    for (let round = 0; round < GAME_ROUNDS; round++) {
      const shuffled = array.sort(() => 0.5 - Math.random());
      this.roundItems[round] = shuffled.slice(0, GAME_ITEMS_PER_ROUND);
    }
  }

  private getGameStartResponse(): RMGameStart {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_START,
      [PARAM.DATA]: {
        [PARAM.GAME_START_TS]: this.gameStartTs,
        [PARAM.GAME_FIELDS]: this.gameFields
      }
    }
  }

  private getGameUpdateResponse(): RMGameUpdate {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_UPDATE,
      [PARAM.DATA]: {
        [PARAM.GAME_ROUND]: this.currentRound,
        [PARAM.GAME_ROUND_ITEMS_IDS]: this.roundItems[this.currentRound],
        [PARAM.GAME_NEXT_UPDATE_TS]: this.nextUpdateTs
      }
    }
  }

  getEndGameResponse(winnerPlayerData: PlayerFullData = null, loserPlayerData: PlayerFullData = null): RMGameEnd {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_END,
      [PARAM.DATA]: {
        [PARAM.GAME_WINNER]: winnerPlayerData,
        [PARAM.GAME_LOSER]: loserPlayerData
      }
    }
  }

  addResponseAfterCollect(response: Response): void {
    response.add({
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_MEPLE_COLLECT,
      [PARAM.DATA]: {
        [PARAM.GAME_ROUND_ITEMS_IDS]: this.roundItems[this.currentRound],
      }
    });
  }
}