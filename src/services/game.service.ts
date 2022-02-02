import { Injectable } from "@nestjs/common";
import { Player } from "../classes/player.class";
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
  static players: Player[] = [];

  constructor() {}

  static registerPlayer(player: Player): void {
    this.players.push(player);
  }

  static unregisterPlayerById(playerId: string): void {
    let index = this.players.findIndex(player => player.id = playerId);
    if (index > -1) {
      this.players.splice(index, 1);
    } else {
      console.error(`can\'t unregister player with id ${playerId}`);
    }
  }

  static isPlayerExists(socket: Socket): boolean {
    return this.players.some(player => player.id === socket.id)
  }
}