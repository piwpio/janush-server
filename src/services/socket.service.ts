import { Injectable } from "@nestjs/common";
import { PlayersService } from "./players.service";
import { ResponseType } from "../models/response.model";
import { GATEWAY } from "../models/gateway.model";

@Injectable()
export class SocketService {
  static broadcast(response: ResponseType): void {
    PlayersService.players.forEach(player => {
      player.socket.emit(GATEWAY.GAME, response)
    });
  }
}