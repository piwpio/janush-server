import { Injectable } from "@nestjs/common";
import { Player } from "../classes/player.class";
import { PlayerId } from "../models/types.model";
import { PARAM } from "../models/param.model";
import { PlayerFullData } from "../models/player.model";
import { Socket } from "socket.io";
import { PayloadPlayerRegister } from "../models/gateway.model";

@Injectable()
export class PlayersService {
  private static players: Player[] = [];

  static getPlayers(): Player[] {
    return this.players;
  }

  static getPlayerById(playerId: PlayerId): Player {
    return this.players.find(player => player.id === playerId);
  }

  // INSTANCE

  private players: Player[] = PlayersService.players;

  getPlayers(): Player[] {
    return this.players;
  }

  registerPlayer(client: Socket, payload: PayloadPlayerRegister): Player {
    const newPlayer = new Player(client, payload[PARAM.PLAYER_NAME]);
    this.players.push(newPlayer);
    return newPlayer;
  }

  unregisterPlayerById(playerId: PlayerId): Player {
    const index = this.players.findIndex(player => player.id === playerId);
    const deleted = this.players.splice(index, 1);
    console.log(deleted);
    return deleted[0];
  }

  isPlayerExists(playerId: PlayerId): boolean {
    return this.players.some(player => player.id === playerId)
  }

  getPlayerById(playerId: PlayerId): Player {
    return this.players.find(player => player.id === playerId);
  }

  getPlayersDataForInit(): PlayerFullData[] {
    const playersData = [];
    this.players.forEach(player => {
      playersData.push(player.getDataFull());
    });
    return playersData;
  }
}