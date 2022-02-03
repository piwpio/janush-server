import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { PlayersService } from "../services/players.service";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class UserExistsGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let client = context.getArgs()[0];
    if (PlayersService.isPlayerExists(client.id)) {
      return true;
    } else {
      throw new WsException('User is not exist');
    }
  }
}
