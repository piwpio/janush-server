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
import { SocketService } from "../services/socket.service";
import { Response } from "../classes/response.class";
import { GATEWAY, PayloadPlayerRegister, PayloadChairPlayerIsReady } from "../models/gateway.model";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { UseGuards } from "@nestjs/common";
import { UserExistsGuard } from "../guards/user-exists.guard";
import { UserNotExistGuard } from "../guards/user-not-exist.guard";
import { TableService } from "../services/table.service";
import { UserOnChair } from "../guards/user-on-chair.guard";
import { UserNotOnChair } from "../guards/user-not-on-chair.guard";

@WebSocketGateway(8080, { cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  // @WebSocketServer()
  // server: Server;

  afterInit() {
    // console.log('GameGateway afterInit');
  }

  handleConnection(client: Socket) {

  }

  handleDisconnect(client: Socket) {
    PlayersService.unregisterPlayerById(client.id);
  }

  @UseGuards(UserNotExistGuard)
  @SubscribeMessage(GATEWAY.PLAYER_REGISTER)
  playerRegister(client: Socket, payload: PayloadPlayerRegister) {
    const newPlayer = new Player(client, payload[PARAM.PLAYER_NAME]);
    PlayersService.registerPlayer(newPlayer);

    const response = new Response();
    newPlayer.afterRegister(response);
    SocketService.broadcast(response.get())
  }

  @UseGuards(UserExistsGuard, UserNotOnChair)
  @SubscribeMessage(GATEWAY.TABLE_SIT)
  tableSit(client: Socket) {
    const table = TableService.getTableInstance();
    const response = new Response();

    table.sit(client.id, response);
    SocketService.broadcast(response.get())
  }

  @UseGuards(UserExistsGuard, UserOnChair)
  @SubscribeMessage(GATEWAY.CHAIR_PLAYER_IS_READY)
  chairPlayerIsReady(client: Socket, payload: PayloadChairPlayerIsReady) {
    const table = TableService.getTableInstance();
    const response = new Response();

    table.playerIsReady(client.id, payload[PARAM.CHAIR_PLAYER_IS_READY], response);
    SocketService.broadcast(response.get())
  }
}