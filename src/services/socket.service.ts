import { Injectable } from "@nestjs/common";
import { GameService } from "./game.service";
import { ResponseType } from "../models/response.model";
import { GATEWAY } from "../models/gateway.model";

@Injectable()
export class SocketService {
  static broadcast(response: ResponseType): void {
    GameService.players.forEach(player => {
      player.socket.emit(GATEWAY.GAME, response)
    });
  }
}