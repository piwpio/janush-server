import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameService } from "../services/game.service";
import { Player } from "../classes/player.class";
import { SocketService } from "../services/socket.service";
import { Response } from "../classes/response.class";
import { GATEWAY, PayloadRegisterPlayer } from "../models/gateway.model";
import { DATA_TYPE, PARAM } from "../models/param.model";

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
    GameService.unregisterPlayerById(client.id);
  }

  @SubscribeMessage(GATEWAY.REGISTER_PLAYER)
  registerName(client: Socket, payload: PayloadRegisterPlayer) {
    if (GameService.isPlayerExists(client)) return;

    let newPlayer = new Player(client);
    GameService.registerPlayer(newPlayer);

    newPlayer.name = payload[PARAM.NAME];

    let response = new Response();
    response.addPlayerDataResponse(DATA_TYPE.REGISTER_PLAYER, newPlayer.getData());
    SocketService.broadcast(response.get())
  }
}