import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { WsException } from "@nestjs/websockets";
import { PARAM } from "../models/param.model";
import { ChairsService } from "../services/chairs.service";

@Injectable()
export class PlayerReadyGuard implements CanActivate {
  constructor(
    private chairsService: ChairsService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let client = context.getArgs()[0];
    let isReady = context.getArgs()[1][PARAM.CHAIR_PLAYER_IS_READY];
    if (this.chairsService.isPlayerReady(client.id) !== isReady) {
      return true;
    } else {
      throw new WsException('Player already ready/not ready.');
    }
  }
}
