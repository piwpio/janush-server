import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { WsException } from "@nestjs/websockets";
import { ChairsService } from "../services/chairs.service";

@Injectable()
export class PlayerOnChair implements CanActivate {
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
      throw new WsException('User is not on chair');
    }
  }
}

@Injectable()
export class PlayerNotOnChair implements CanActivate {
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
      throw new WsException('User is sitting on chair already');
    }
  }
}
