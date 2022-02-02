import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { DATA_KEY, DATA_PARAM, DMRegisterPlayer } from "../models/data.model";
import { GameService } from "../services/game.service";
import { Player } from "../classes/player.class";
import { SocketService } from "../services/socket.service";

@WebSocketGateway(8080, { cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor() {}

  afterInit() {
    // console.log('GameGateway afterInit');
  }

  handleConnection(client: Socket) {

  }

  handleDisconnect(client: Socket) {
    GameService.unregisterPlayerById(client.id);
  }

  @SubscribeMessage(DATA_KEY.REGISTER_PLAYER)
  registerName(client: Socket, payload: DMRegisterPlayer) {
    if (GameService.isPlayerExists(client)) return;

    let newPlayer = new Player(client);
    GameService.registerPlayer(newPlayer);

    newPlayer.name = payload[DATA_PARAM.NAME];
    newPlayer.brodcastChanges();
  }
}