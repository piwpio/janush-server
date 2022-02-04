import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage, WebSocketGateway
} from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { PlayersService } from "../services/players.service";
import { Player } from "../classes/player.class";
import { Response } from "../classes/response.class";
import { GATEWAY, PayloadPlayerRegister, PayloadChairPlayerIsReady } from "../models/gateway.model";
import { PARAM } from "../models/param.model";
import { UseGuards } from "@nestjs/common";
import { PlayerExistsGuard, PlayerNotExistGuard } from "../guards/player-exists.guard";
import { TableService } from "../services/table.service";
import { PlayerNotOnChair, PlayerOnChair } from "../guards/player-on-chair.guard";
import { PlayerReadyGuard } from "../guards/player-ready.guard";
import { PlayerNotOnTable, PlayerOnTable } from "../guards/player-on-table.guard";
import { PlayerLimitGuard } from "../guards/player-limit.guard";

@WebSocketGateway(8080, { cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  afterInit() {}
  handleConnection(client: Socket) {}

  @UseGuards(PlayerExistsGuard)
  handleDisconnect(client: Socket) {
    const table = TableService.getTableInstance();
    const response = new Response();

    if (TableService.isPlayerOnTable(client.id)) {
      table.standFrom(client.id, response);
    }
    PlayersService.unregisterPlayerById(client.id);
    response.broadcast();
  }

  @UseGuards(PlayerLimitGuard, PlayerNotExistGuard)
  @SubscribeMessage(GATEWAY.PLAYER_REGISTER)
  playerRegister(client: Socket, payload: PayloadPlayerRegister) {
    const newPlayer = new Player(client, payload[PARAM.PLAYER_NAME]);
    PlayersService.registerPlayer(newPlayer);

    const response = new Response();
    newPlayer.afterRegister(response);
    response.broadcast();
  }

  @UseGuards(PlayerExistsGuard, PlayerNotOnTable)
  @SubscribeMessage(GATEWAY.TABLE_SIT_TO)
  tableSitTo(client: Socket) {
    const table = TableService.getTableInstance();
    const response = new Response();

    table.sitTo(client.id, response);
    response.broadcast();
  }

  @UseGuards(PlayerExistsGuard, PlayerOnTable)
  @SubscribeMessage(GATEWAY.TABLE_STAND_FROM)
  tableStandFrom(client: Socket) {
    const table = TableService.getTableInstance();
    const response = new Response();

    table.standFrom(client.id, response);
    response.broadcast();
  }

  @UseGuards(PlayerExistsGuard, PlayerOnChair, PlayerReadyGuard)
  @SubscribeMessage(GATEWAY.CHAIR_PLAYER_SET_READY)
  chairPlayerSetReady(client: Socket, payload: PayloadChairPlayerIsReady) {
    const table = TableService.getTableInstance();
    const response = new Response();

    table.setPlayerReady(client.id, payload[PARAM.CHAIR_PLAYER_IS_READY], response);
    response.broadcast();
  }
}