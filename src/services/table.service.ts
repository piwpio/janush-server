import { Injectable } from "@nestjs/common";
import { Table } from "../classes/table.class";
import { PlayerId } from "../models/types.model";
import { RMTableChange } from "../models/response.model";
import { Response } from "../classes/response.class";
import { GAME_MIN_ROUND_PLAYED_TO_GET_WIN_AFTER_SURRENDER } from "../config";
import { ChairsService } from "./chairs.service";
import { GameService } from "./game.service";
import { PlayersService } from "./players.service";

@Injectable()
export class TableService {
  private static instance: TableService;
  private readonly table: Table = new Table();

  constructor(
    private chairsService: ChairsService,
    private gameService: GameService,
    private playersService: PlayersService
  ) {
    TableService.instance = this;
  }

  static getInstance(): TableService {
    return this.instance;
  }

  getTable(): Table {
    return this.table;
  }

  isPlayerInQueue(playerId: PlayerId): boolean {
    return this.table.isPlayerInQueue(playerId);
  }

  tableStandFromLogic(playerId: PlayerId, response: Response): void {
    const playerChair = this.chairsService.getPlayerChair(playerId);
    const table = this.getTable();
    const game = this.gameService.getGame()

    if (playerChair) {
      playerChair.standUp(response);

      if (game.isGameStarted) {
        const winnerChair = this.chairsService.getOppositeChair(playerChair);
        winnerChair.setReady(false, response);

        const winnerPlayer = this.playersService.getPlayerById(winnerChair.playerId)
        if (game.currentRound >= GAME_MIN_ROUND_PLAYED_TO_GET_WIN_AFTER_SURRENDER) {
          ++winnerPlayer.maxWinStreak;
        }

        const winnerPlayerData = winnerPlayer.getDataForEndGame();
        const loserPlayerData = winnerPlayer.getDataForEndGame();
        const endGameResponse = game.getEndGameResponse(winnerPlayerData, loserPlayerData)
        response.add(endGameResponse);

        game.resetGame();
      }

    } else if (table.isPlayerInQueue(playerId)) {
      table.removeFromQueue(playerId, response);
    }
  }

  getTableResponse(): RMTableChange {
    return this.table.getResponse();
  }
}