import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway
} from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { PlayersService } from "../services/players.service";
import { Response } from "../classes/response.class";
import { GATEWAY, PayloadChairPlayerIsReady, PayloadPlayerRegister } from "../models/gateway.model";
import { UseGuards } from "@nestjs/common";
import { PlayerExistsGuard, PlayerNotExistGuard } from "../guards/player-exists.guard";
import { TableService } from "../services/table.service";
import { PlayerNotOnTable, PlayerOnTable } from "../guards/player-on-table.guard";
import { PlayerLimitGuard } from "../guards/player-limit.guard";
import { DataService } from "../services/data.service";
import { ChairsService } from "../services/chairs.service";
import { GameService } from "../services/game.service";
import { CHAIR_ID } from "../models/chair.model";
import { PlayerOnChair } from "../guards/player-on-chair.guard";
import { PlayerReadyGuard } from "../guards/player-ready.guard";
import { PARAM } from "../models/param.model";
import { GAME_MIN_ROUND_PLAYED_TO_GET_WIN_AFTER_SURRENDER } from "../config";
import { PlayerId } from "../models/types.model";

@WebSocketGateway(8080, { cors: true })
export class MainGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private playersService: PlayersService,
    private tableService: TableService,
    private chairsService: ChairsService,
    private gameService: GameService,
    private dataService: DataService,
  ) {}

  afterInit() {}

  handleConnection(client: Socket) {
    const player = PlayersService.getPlayerById(client.id)
    if (!player) return;

    player.socket = client;

    const initDataResponse = new Response();
    this.dataService.addInitDataToResponse(initDataResponse);
    player.socket.emit(GATEWAY.MAIN, initDataResponse.get());

    const response = new Response();
    player.addResponseAfterRegister(response);
    response.broadcast();
  }

  handleDisconnect(client: Socket) {
    const playerId = client.id;

    if (!this.playersService.isPlayerExists(client.id)) return;

    const response = new Response();

    if (this.chairsService.isPlayerOnChair(playerId) || this.tableService.isPlayerInQueue(playerId)) {
      this.tableStandFromLogic(client.id, response);
    }

    const unregisteredPlayer = this.playersService.unregisterPlayerById(client.id);
    unregisteredPlayer.addResponseAfterUnRegister(response);

    response.broadcast();
  }

  @UseGuards(PlayerLimitGuard, PlayerNotExistGuard)
  @SubscribeMessage(GATEWAY.PLAYER_REGISTER)
  playerRegister(client: Socket, payload: PayloadPlayerRegister) {
    const newPlayer = this.playersService.registerPlayer(client, payload);

    const initDataResponse = new Response();
    this.dataService.addInitDataToResponse(initDataResponse);

    newPlayer.socket.emit(GATEWAY.MAIN, initDataResponse.get());

    const broadcastResponse = new Response();
    newPlayer.addResponseAfterRegister(broadcastResponse);

    broadcastResponse.broadcast();
  }

  @UseGuards(PlayerExistsGuard, PlayerNotOnTable)
  @SubscribeMessage(GATEWAY.TABLE_SIT_TO)
  tableSitTo(client: Socket) {
    const playerId = client.id
    const response = new Response();
    const chair1 = this.chairsService.getChair(CHAIR_ID.ID1);
    const chair2 = this.chairsService.getChair(CHAIR_ID.ID2);
    const table = this.tableService.getTable();

    if (!chair1.isBusy) {
      chair1.sitDown(playerId, response)
    } else if (!chair2.isBusy) {
      chair2.sitDown(playerId, response);
    } else {
      table.addToQueue(playerId, response);
    }

    response.broadcast();
  }

  @UseGuards(PlayerExistsGuard, PlayerOnTable)
  @SubscribeMessage(GATEWAY.TABLE_STAND_FROM)
  tableStandFrom(client: Socket) {
    const response = new Response();
    this.tableStandFromLogic(client.id, response)

    response.broadcast();
  }

  @UseGuards(PlayerExistsGuard, PlayerOnChair, PlayerReadyGuard)
  @SubscribeMessage(GATEWAY.CHAIR_PLAYER_SET_READY)
  chairPlayerSetReady(client: Socket, payload: PayloadChairPlayerIsReady) {
    const playerId = client.id;
    const isReady = payload[PARAM.CHAIR_PLAYER_IS_READY];
    const response = new Response();

    this.chairsService.getPlayerChair(playerId)?.setReady(isReady, response);

    if (this.chairsService.getChair(CHAIR_ID.ID1).isReady && this.chairsService.getChair(CHAIR_ID.ID2).isReady) {
      const game = this.gameService.getGame();
      game.startGame(response)
    }

    response.broadcast();
  }

  private tableStandFromLogic(playerId: PlayerId, response: Response): void {
    const playerChair = this.chairsService.getPlayerChair(playerId);
    const table = this.tableService.getTable();
    const game = this.gameService.getGame()

    if (playerChair) {
      playerChair.standUp(response);

      if (game.isGameStarted) {
        const winnerChair = this.chairsService.getOppositeChair(playerChair);
        winnerChair.setReady(false, response);

        if (game.currentRound >= GAME_MIN_ROUND_PLAYED_TO_GET_WIN_AFTER_SURRENDER) {
          const winnerPlayer = this.playersService.getPlayerById(winnerChair.playerId)
          ++winnerPlayer.winstreak;
        }

        const winnerPlayerId = winnerChair.playerId;
        response.add(game.getEndGameResponse(winnerPlayerId));

        game.resetGame();
      }

    } else if (table.isPlayerInQueue(playerId)) {
      table.removeFromQueue(playerId, response);
    }
  }
}