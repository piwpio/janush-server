import { Injectable } from "@nestjs/common";
import { Response } from "../classes/response.class";
import { PlayersService } from "./players.service";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { TableService } from "./table.service";

@Injectable()
export class DataService {
  static addInitDataToResponse(response: Response): void {
    const playersData = PlayersService.getPlayersData();
    const [tableResponse, chair1Response, chair2Response] = TableService.getTableData();

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