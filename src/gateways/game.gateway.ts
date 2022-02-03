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
import { GATEWAY, PayloadPlayerRegister, PayloadTablePlayerIsReady } from "../models/gateway.model";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { UseGuards } from "@nestjs/common";
import { UserExistsGuard } from "../guards/user-exists.guard";
import { UserNotExistGuard } from "../guards/user-not-exist.guard";
import { TableService } from "../services/table.service";
import { UserOnChair } from "../guards/user-on-chair.service";

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
    newPlayer.addPlayerToResponse(response, DATA_TYPE.PLAYER_REGISTER);
    SocketService.broadcast(response.get())
  }

  @UseGuards(UserExistsGuard)
  @SubscribeMessage(GATEWAY.TABLE_SIT)
  tableSit(client: Socket) {
    const table = TableService.getTableInstance();
    const response = new Response();

    table.sit(client.id, response);
    SocketService.broadcast(response.get())
  }

  @UseGuards(UserExistsGuard, UserOnChair)
  @SubscribeMessage(GATEWAY.TABLE_PLAYER_IS_READY)
  tablePlayerIsReady(client: Socket, payload: PayloadTablePlayerIsReady) {
    const table = TableService.getTableInstance();
    const response = new Response();

    table.playerReady(client.id, payload[PARAM.TABLE_PLAYER_IS_READY], response);
    SocketService.broadcast(response.get())
  }
}