import { Injectable } from "@nestjs/common";
import { DATA_KEY, DATA_PARAM, DataSModel } from "../models/data.model";
import { GameService } from "./game.service";

@Injectable()
export class SocketService {
  static broadcast(dataKey: DATA_KEY, data: DataSModel): void {
    GameService.players.forEach(player => {
      if (data[DATA_PARAM.PLAYER_ID] !== player.id)
        player.socket.emit(dataKey, data)
    })
  }
}