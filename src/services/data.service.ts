import { Injectable } from "@nestjs/common";
import { Response } from "../classes/response.class";
import { PlayersService } from "./players.service";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { TableService } from "./table.service";
import { ChairsService } from "./chairs.service";

@Injectable()
export class DataService {
  constructor(
    private playersService: PlayersService,
    private tableService: TableService,
    private chairsService: ChairsService
  ) {}

  addInitDataToResponse(response: Response): void {
    const playersData = this.playersService.getPlayersDataForInit();
    const tableResponse = this.tableService.getTableResponse();
    const [chair1Response, chair2Response] = this.chairsService.getChairsResponse();

    response.add({
      [PARAM.DATA_TYPE]: DATA_TYPE.INIT,
      [PARAM.DATA]: {
        [PARAM.INIT_PLAYERS]: playersData,
        [PARAM.INIT_TABLE]: tableResponse[PARAM.DATA],
        [PARAM.INIT_CHAIRS]: [chair1Response[PARAM.DATA], chair2Response[PARAM.DATA]]
      }
    })
  }
}