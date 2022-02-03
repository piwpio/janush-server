import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { PlayersService } from "../services/players.service";
import { Player } from "../classes/player.class";
import { Response } from "../classes/response.class";
import { GATEWAY, PayloadPlayerRegister, PayloadChairPlayerIsReady } from "../models/gateway.model";
import { PARAM } from "../models/param.model";
import { UseGuards } from "@nestjs/common";
import { UserExistsGuard, UserNotExistGuard } from "../guards/user-exists.guard";
import { TableService } from "../services/table.service";
import { UserNotOnChair, UserOnChair } from "../guards/user-on-chair.guard";
import { UserReadyGuard } from "../guards/user-ready.guard";

@WebSocketGateway(8080, { cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  // @WebSocketServer()
  // server: Server;

  afterInit() {}

  handleConnection(client: Socket) {

  }

  @UseGuards(UserExistsGuard)
  handleDisconnect(client: Socket) {
    const table = TableService.getTableInstance();
    const response = new Response();

    table.standFrom(client.id, response);
    PlayersService.unregisterPlayerById(client.id);

    response.broadcast();

  }

  @UseGuards(UserNotExistGuard)
  @SubscribeMessage(GATEWAY.PLAYER_REGISTER)
  playerRegister(client: Socket, payload: PayloadPlayerRegister) {
    const newPlayer = new Player(client, payload[PARAM.PLAYER_NAME]);
    PlayersService.registerPlayer(newPlayer);

    const response = new Response();
    newPlayer.afterRegister(response);
    response.broadcast();
  }

  @UseGuards(UserExistsGuard, UserNotOnChair)
  @SubscribeMessage(GATEWAY.TABLE_SIT_TO)
  tableSitTo(client: Socket) {
    const table = TableService.getTableInstance();
    const response = new Response();

    table.sitTo(client.id, response);
    response.broadcast();
  }

  @UseGuards(UserExistsGuard, UserOnChair)
  @SubscribeMessage(GATEWAY.TABLE_STAND_FROM)
  tableStandFrom(client: Socket) {
    const table = TableService.getTableInstance();
    const response = new Response();

    table.standFrom(client.id, response);
    response.broadcast();
  }

  @UseGuards(UserExistsGuard, UserOnChair, UserReadyGuard)
  @SubscribeMessage(GATEWAY.CHAIR_PLAYER_IS_READY)
  chairPlayerIsReady(client: Socket, payload: PayloadChairPlayerIsReady) {
    const table = TableService.getTableInstance();
    const response = new Response();

    table.playerIsReady(client.id, payload[PARAM.CHAIR_PLAYER_IS_READY], response);
    response.broadcast();
  }
}