import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { WsException } from "@nestjs/websockets";
import { PARAM } from "../models/param.model";
import { CHAT_MESSAGE_MAXLENGTH, NAME_MAXLENGTH } from "../config";

@Injectable()
export class ChatMessageGuard implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let message = context.getArgs()[1][PARAM.CHAT_MESSAGE];
    if (message?.length <= CHAT_MESSAGE_MAXLENGTH) {
      return true;
    } else {
      throw new WsException('Chat message too long.');
    }
  }
}

@Injectable()
export class PlayerNameGuard implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let name = context.getArgs()[1][PARAM.PLAYER_NAME];
    if (name?.length <= NAME_MAXLENGTH) {
      return true;
    } else {
      throw new WsException('Player name too long.');
    }
  }
}
