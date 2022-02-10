import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { WsException } from "@nestjs/websockets";
import { ChairsService } from "../services/chairs.service";

@Injectable()
export class PlayerOnChairGuard implements CanActivate {
  constructor(
    private chairsService: ChairsService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let client = context.getArgs()[0];
    if (this.chairsService.isPlayerOnChair(client.id)) {
      return true;
    } else {
      throw new WsException('Player is not on chair.');
    }
  }
}

@Injectable()
export class PlayerNotOnChairGuard implements CanActivate {
  constructor(
    private chairsService: ChairsService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let client = context.getArgs()[0];
    if (!this.chairsService.isPlayerOnChair(client.id)) {
      return true;
    } else {
      throw new WsException('Player is sitting on chair already.');
    }
  }
}
