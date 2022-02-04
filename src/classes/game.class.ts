import { Response } from "./response.class";
import { GAME_ITEMS_PER_ROUND, GAME_ROUNDS, GAME_START_TIMEOUT } from "../config";
import { RMGameEnd, RMGameStart } from "../models/response.model";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { PlayerId } from "../models/types.model";
import { PlayersService } from "../services/players.service";

export class Game {
  public isGameStarted = false;
  public currentRound = 0;
  private roundItems: number[][] = [];
  private gameStartTs = 0;

  startGame(response: Response): void {
    this.isGameStarted = true;
    this.currentRound = 0;

    // Randomize round items
    const array = Array.from({ length:40 }, (v,k) => k);
    for (let round = 0; round < GAME_ROUNDS; round++) {
      const shuffled = array.sort(() => 0.5 - Math.random());
      this.roundItems[round] = shuffled.slice(0, GAME_ITEMS_PER_ROUND);
    }

    this.gameStartTs = Date.now() + GAME_START_TIMEOUT;
    response.add(this.getNewGameResponse());
  }

  resetGame(): void {
    this.isGameStarted = false;
    this.currentRound = 0;
    this.roundItems = [];
    this.gameStartTs = 0;
  }

  private getNewGameResponse(): RMGameStart {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_START,
      [PARAM.DATA]: {
        [PARAM.GAME_START_TS]: this.gameStartTs,
        [PARAM.GAME_ROUND]: this.currentRound
      }
    }
  }

  getEndGameResponse(playerWinnerId: PlayerId): RMGameEnd {
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.GAME_END,
      [PARAM.DATA]: {
        [PARAM.GAME_WINNER]: PlayersService.getPlayerById(playerWinnerId)?.getDataFull()
      }
    }
  }
}