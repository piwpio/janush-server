import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { WsException } from "@nestjs/websockets";
import { TableService } from "../services/table.service";
import { PARAM } from "../models/param.model";

@Injectable()
export class PlayerReadyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let client = context.getArgs()[0];
    let isReady = context.getArgs()[1][PARAM.CHAIR_PLAYER_IS_READY];
    if (TableService.isPlayerReady(client.id) !== isReady) {
      return true;
    } else {
      throw new WsException('User already ready/not ready');
    }
  }
}
