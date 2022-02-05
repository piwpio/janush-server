import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MainGateway } from "./gateways/main.gateway";
import { PlayersService } from "./services/players.service";
import { SocketService } from "./services/socket.service";
import { TableService } from "./services/table.service";
import { DataService } from "./services/data.service";
import { ChairsService } from "./services/chairs.service";
import { GameService } from "./services/game.service";
import { MeplesService } from "./services/meples.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    PlayersService,
    TableService,
    ChairsService,
    GameService,
    MeplesService,
    DataService,
    SocketService,
    DataService,
    MainGateway
  ],
})
export class AppModule {}
