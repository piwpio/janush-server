import { Injectable } from "@nestjs/common";
import { Player } from "../classes/player.class";
import { PlayerId } from "../models/types.model";

@Injectable()
export class PlayersService {
  static players: Player[] = [];

  static registerPlayer(player: Player): void {
    this.players.push(player);
  }

  static unregisterPlayerById(playerId: PlayerId): void {
    let index = this.players.findIndex(player => player.id === playerId);
    this.players.splice(index, 1);
  }

  static isPlayerExists(playerId: PlayerId): boolean {
    return this.players.some(player => player.id === playerId)
  }

  static getPlayerById(playerId: PlayerId): Player {
    return this.players.find(player => player.id === playerId);
  }
}