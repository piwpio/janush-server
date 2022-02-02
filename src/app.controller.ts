import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Player } from "./classes/player/player.class";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {
    let player = new Player('asd');
    console.log(player);
    player.name = 'dupa';
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
