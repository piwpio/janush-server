import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { WsException } from "@nestjs/websockets";
import { TableService } from "../services/table.service";

@Injectable()
export class UserOnChair implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let client = context.getArgs()[0];
    if (TableService.isUserOnChair(client.id)) {
      return true;
    } else {
      throw new WsException('User is not on chair');
    }
  }
}