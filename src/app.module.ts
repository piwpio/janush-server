import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GameGateway } from "./gateways/game.gateway";
import { GameService } from "./services/game.service";
import { SocketService } from "./services/socket.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [GameService, SocketService, GameGateway],
})
export class AppModule {}
