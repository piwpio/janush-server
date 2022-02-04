import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { PlayersService } from "../services/players.service";
import { MAX_PLAYERS } from "../config";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class PlayerLimitGuard implements CanActivate {
  constructor(
    private playersService: PlayersService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.playersService.getPlayers().length < MAX_PLAYERS) {
      return true;
    } else {
      throw new WsException('Registered players limit reached, sorry :(');
    }
  }
}