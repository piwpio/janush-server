import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { WsException } from "@nestjs/websockets";
import { GameService } from "../services/game.service";

@Injectable()
export class GameStarted implements CanActivate {
  constructor(
    private gameService: GameService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.gameService.isGameStarted()) {
      return true;
    } else {
      throw new WsException('Game not started');
    }
  }
}

@Injectable()
export class GameNotStarted implements CanActivate {
  constructor(
    private gameService: GameService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (!this.gameService.isGameStarted()) {
      return true;
    } else {
      throw new WsException('Game not started');
    }
  }
}
