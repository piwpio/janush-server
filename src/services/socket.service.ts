import { Injectable } from "@nestjs/common";
import { Player } from "../classes/player/player.class";
import { DATA_KEY } from "../models/data.model";

@Injectable()
export class SocketService {
  private static players: Player[] = [];

  static addPlayer(player: Player): void {
    this.players.push(player);
  }

  static broadcast(dataKey: DATA_KEY, data: any): void {
    this.players.forEach(player => {
      player.getSocket().emit(data)
    })
  }
}