import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GameGateway } from "./gateways/game.gateway";
import { PlayersService } from "./services/players.service";
import { SocketService } from "./services/socket.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PlayersService, SocketService, GameGateway],
})
export class AppModule {}
