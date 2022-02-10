import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { WsException } from "@nestjs/websockets";
import { PARAM } from "../models/param.model";
import { CHAT_MESSAGE_MAXLENGTH, NAME_MAXLENGTH } from "../config";
import { CHAT_SYSTEM } from "../models/types.model";
import { PlayersService } from "../services/players.service";

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
  constructor(
    private playersService: PlayersService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let name = context.getArgs()[1][PARAM.PLAYER_NAME];
    const nameLengthValid = name?.length <= NAME_MAXLENGTH;
    const nameNotSystemValid = name.toLowerCase() !== CHAT_SYSTEM.toLowerCase();
    const nameNotExists = !this.playersService.getPlayerByName(name);
    if (nameLengthValid && nameNotSystemValid && nameNotExists) {
      return true;
    } else {
      throw new WsException('Player wrong name.');
    }
  }
}
