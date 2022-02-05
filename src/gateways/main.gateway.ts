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
import { GATEWAY, PayloadChairPlayerIsReady, PayloadMepleMove, PayloadPlayerRegister } from "../models/gateway.model";
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
import { GAME_FIELDS, GAME_MIN_ROUND_PLAYED_TO_GET_WIN_AFTER_SURRENDER, GAME_POWER_POINTS } from "../config";
import { PlayerId } from "../models/types.model";
import { GameStarted } from "../guards/game-started.guard";
import { MeplesService } from "../services/meples.service";
import { MOVE_DIRECTION } from "../models/meple.model";

@WebSocketGateway(8080, { cors: true })
export class MainGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private playersService: PlayersService,
    private tableService: TableService,
    private chairsService: ChairsService,
    private meplesService: MeplesService,
    private gameService: GameService,
    private dataService: DataService,
  ) {}

  afterInit() {}

  handleConnection(client: Socket) {
    const player = this.playersService.getPlayerById(client.id)
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
      this.tableService.tableStandFromLogic(client.id, response);
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
    this.tableService.tableStandFromLogic(client.id, response)

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
      game.startGameTimeout(response)
    }

    response.broadcast();
  }

  @UseGuards(PlayerExistsGuard, PlayerOnChair, GameStarted)
  @SubscribeMessage(GATEWAY.MEPLE_MOVE)
  mepleMove(client: Socket, payload: PayloadMepleMove) {
    const playerId = client.id;
    const moveDirection = payload[PARAM.MEPLE_MOVE_DIRECTION];
    const response = new Response();
    const playerChair = this.chairsService.getPlayerChair(playerId);
    const playerMepel = this.meplesService.getMeple(playerChair.id);

    if (moveDirection === MOVE_DIRECTION.ASC) {
      ++playerMepel.fieldIndex;
      if (playerMepel.fieldIndex >= GAME_FIELDS) playerMepel.fieldIndex = 0;
    } else {
      --playerMepel.fieldIndex;
      if (playerMepel.fieldIndex < 0) playerMepel.fieldIndex = GAME_FIELDS - 1;
    }
    playerMepel.addResponse(response);

    response.broadcast();
  }

  @UseGuards(PlayerExistsGuard, PlayerOnChair, GameStarted)
  @SubscribeMessage(GATEWAY.MEPLE_COLLECT)
  mepleCollect(client: Socket) {
    const playerId = client.id;
    const response = new Response();
    const game = this.gameService.getGame();
    const playerChair = this.chairsService.getPlayerChair(playerId);
    const playerMepel = this.meplesService.getMeple(playerChair.id);

    const roundActiveFields = game.roundItems[game.currentRound]
    const fieldIndex = roundActiveFields.findIndex(field => field === playerMepel.fieldIndex);
    if (fieldIndex > -1) {
      if (fieldIndex === 0) {
        playerMepel.points += GAME_POWER_POINTS;
      } else {
        ++playerMepel.points;
      }
      roundActiveFields[fieldIndex] *= -1;

      game.addResponseAfterCollect(response);
      playerMepel.addResponse(response);

      response.broadcast();
    }
  }
}