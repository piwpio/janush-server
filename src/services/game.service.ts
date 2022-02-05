import { Injectable } from "@nestjs/common";
import { Game } from "../classes/game.class";

@Injectable()
export class GameService {
  private game: Game = new Game();

  getGame(): Game {
    return this.game;
  }

  isGameStarted(): boolean {
    return this.game.isGameStarted;
  }
}