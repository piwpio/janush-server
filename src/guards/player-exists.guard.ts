import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { PlayersService } from "../services/players.service";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class PlayerExistsGuard implements CanActivate {
  constructor(
    private playersService: PlayersService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let client = context.getArgs()[0];
    if (this.playersService.isPlayerExists(client.id)) {
      return true;
    } else {
      throw new WsException('User is not exist');
    }
  }
}

@Injectable()
export class PlayerNotExistGuard implements CanActivate {
  constructor(
    private playersService: PlayersService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let client = context.getArgs()[0];
    if (!this.playersService.isPlayerExists(client.id)) {
      return true;
    } else {
      throw new WsException('User already exist');
    }
  }
}
