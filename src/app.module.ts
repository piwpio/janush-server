import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MainGateway } from "./gateways/main.gateway";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [MainGateway],
})
export class AppModule {}
