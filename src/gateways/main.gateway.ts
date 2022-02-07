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
import { PlayerOnChair } from "../guards/player-on-chair.guard";
import { PlayerReadyGuard } from "../guards/player-ready.guard";
import { PARAM } from "../models/param.model";
import { COLLECT_COOLDOWN, GAME_FIELDS, GAME_POWER_POINTS } from "../config";
import { GameNotStarted, GameStarted } from "../guards/game-started.guard";
import { MeplesService } from "../services/meples.service";
import { GENERAL_ID, MOVE_DIRECTION } from "../models/types.model";

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

    // const initDataResponse = new Response();
    // this.dataService.addInitDataToResponse(initDataResponse);
    // player.socket.emit(GATEWAY.MAIN, initDataResponse.get());

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
    const chair1 = this.chairsService.getChair(GENERAL_ID.ID1);
    const chair2 = this.chairsService.getChair(GENERAL_ID.ID2);
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

  @UseGuards(GameNotStarted, PlayerExistsGuard, PlayerOnChair, PlayerReadyGuard)
  @SubscribeMessage(GATEWAY.CHAIR_PLAYER_SET_READY)
  chairPlayerSetReady(client: Socket, payload: PayloadChairPlayerIsReady) {
    const playerId = client.id;
    const isReady = payload[PARAM.CHAIR_PLAYER_IS_READY];
    const response = new Response();

    this.chairsService.getPlayerChair(playerId)?.setReady(isReady, response);

    if (this.chairsService.getChair(GENERAL_ID.ID1).isReady && this.chairsService.getChair(GENERAL_ID.ID2).isReady) {
      this.meplesService.getMeple(GENERAL_ID.ID1).setAfterGameStarts(response)
      this.meplesService.getMeple(GENERAL_ID.ID2).setAfterGameStarts(response)
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
    const playerMeple = this.meplesService.getMeple(playerChair.id);
    const enemyMeple = this.meplesService.getOppositeMeple(playerMeple);

    if (moveDirection === MOVE_DIRECTION.ASC) {
      ++playerMeple.fieldIndex;
      if (playerMeple.fieldIndex >= GAME_FIELDS) playerMeple.fieldIndex = 0;
      if (enemyMeple.fieldIndex === playerMeple.fieldIndex) ++playerMeple.fieldIndex;
    } else {
      --playerMeple.fieldIndex;
      if (enemyMeple.fieldIndex === playerMeple.fieldIndex) --playerMeple.fieldIndex;
      if (playerMeple.fieldIndex < 0) playerMeple.fieldIndex = GAME_FIELDS - 1;
    }
    playerMeple.addResponse(response);

    response.broadcast();
  }

  @UseGuards(PlayerExistsGuard, PlayerOnChair, GameStarted)
  @SubscribeMessage(GATEWAY.MEPLE_COLLECT)
  mepleCollect(client: Socket) {
    const playerId = client.id;
    const playerChair = this.chairsService.getPlayerChair(playerId);
    const playerMeple = this.meplesService.getMeple(playerChair.id);

    //DEBUG
    // const cooldown = playerMeple.lastActionTs + COLLECT_COOLDOWN > Date.now();
    if (playerMeple.lastActionTs + COLLECT_COOLDOWN > Date.now()) return;
    playerMeple.lastActionTs = Date.now();

    const game = this.gameService.getGame();
    const roundItems = game.roundItems[game.currentRound];
    if (!roundItems) return;

    const fieldsMap = game.gameFieldsMap;
    const itemOnPlayerField = fieldsMap[playerMeple.fieldIndex];

    // Object.is() is for comparing zeros ex:
    // 0 === -0 // true
    // Object.is(0, -0) // false
    const fieldIndex = roundItems.findIndex(item => Object.is(item, itemOnPlayerField));

    // DEBUG
    // console.log('##########################################')
    // console.log('Player fieldIndex', playerMeple.fieldIndex)
    // console.log('Item on player field', itemOnPlayerField)
    // console.log('Round items', roundItems)
    // console.log('Found?', fieldIndex > -1)
    // console.log('Cooldown', cooldown)
    // if (cooldown) return;

    if (fieldIndex > -1) {
      const response = new Response();

      roundItems[fieldIndex] *= -1;
      game.addResponseAfterCollect(response);
      playerMeple.collect(fieldIndex === 0 ? GAME_POWER_POINTS : 1, response);

      response.broadcast();
    }
  }
}