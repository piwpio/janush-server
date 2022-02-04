import { Injectable } from "@nestjs/common";
import { PlayersService } from "./players.service";
import { ResponseType } from "../models/response.model";
import { GATEWAY } from "../models/gateway.model";

@Injectable()
export class SocketService {
  static broadcast(response: ResponseType): void {
    if (!response.length) return;

    PlayersService.getPlayers().forEach(player => {
      player.socket.emit(GATEWAY.MAIN, response)
    });
  }
}