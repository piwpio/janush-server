import { Injectable } from "@nestjs/common";
import { Player } from "../classes/player.class";
import { PlayerId } from "../models/types.model";

@Injectable()
export class PlayersService {
  static players: Player[] = [];

  static registerPlayer(player: Player): void {
    this.players.push(player);
    console.log(`registered player with id ${player.id}`)
  }

  static unregisterPlayerById(playerId: PlayerId): void {
    let index = this.players.findIndex(player => player.id === playerId);
    if (index > -1) {
      this.players.splice(index, 1);
    } else {
      console.error(`can\'t unregister player with id ${playerId}`);
    }
  }

  static isPlayerExists(playerId: PlayerId): boolean {
    return this.players.some(player => player.id === playerId)
  }

  static getPlayerById(playerId: PlayerId): Player {
    return this.players.find(player => player.id === playerId);
  }
}