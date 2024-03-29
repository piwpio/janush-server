import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { WsException } from "@nestjs/websockets";
import { TableService } from "../services/table.service";
import { ChairsService } from "../services/chairs.service";

@Injectable()
export class PlayerOnTableGuard implements CanActivate {
  constructor(
    private tableService: TableService,
    private chairsService: ChairsService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let client = context.getArgs()[0];
    if (this.chairsService.isPlayerOnChair(client.id) || this.tableService.isPlayerInQueue(client.id)) {
      return true;
    } else {
      throw new WsException('Player is not on table.');
    }
  }
}

@Injectable()
export class PlayerNotOnTableGuard implements CanActivate {
  constructor(
    private tableService: TableService,
    private chairsService: ChairsService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let client = context.getArgs()[0];
    if (!(this.chairsService.isPlayerOnChair(client.id) || this.tableService.isPlayerInQueue(client.id))) {
      return true;
    } else {
      throw new WsException('Player is sitting on table already.');
    }
  }
}
