import { Injectable } from "@nestjs/common";
import { Response } from "../classes/response.class";
import { PlayersService } from "./players.service";
import { TableService } from "./table.service";
import { ChairsService } from "./chairs.service";
import { GENERAL_ID } from "../models/types.model";
import { MeplesService } from "./meples.service";
import { GameService } from "./game.service";
import { ChatService } from "./chat.service";

@Injectable()
export class DataService {
  constructor(
    private playersService: PlayersService,
    private tableService: TableService,
    private chairsService: ChairsService,
    private meplesService: MeplesService,
    private gameService: GameService,
    private chatService: ChatService
  ) {}

  addInitDataToResponse(response: Response): void {
    response.add(this.tableService.getTable().getResponse());
    response.add(this.chairsService.getChair(GENERAL_ID.ID1).getResponse());
    response.add(this.chairsService.getChair(GENERAL_ID.ID2).getResponse());
    response.add(this.gameService.getGame().getInitResponse());
    response.add(this.meplesService.getMeple(GENERAL_ID.ID1).getResponse());
    response.add(this.meplesService.getMeple(GENERAL_ID.ID2).getResponse());
    response.add(this.chatService.getChatInitResponse());
  }
}
