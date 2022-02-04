import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { PlayersService } from "../services/players.service";
import { MAX_PLAYERS } from "../config";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class PlayerLimitGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (PlayersService.players.length < MAX_PLAYERS) {
      return true;
    } else {
      throw new WsException('Registered users limit reached, sorry :(');
    }
  }
}