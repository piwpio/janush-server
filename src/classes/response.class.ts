import {
  ResponseModel,
  ResponseType, RMChair,
  RMChairData,
  RMPlayer,
  RMPlayerData,
  RMTable,
  RMTableData
} from "../models/response.model";

import { DATA_TYPE, PARAM } from "../models/param.model";

export class Response {
  private response: ResponseType = [];

  constructor() {}

  get(): ResponseType {
    return this.response
  }

  private add(response: ResponseModel): Response {
    this.response.push(response);
    return this;
  }

  addPlayerDataResponse(
    dataType: DATA_TYPE.PLAYER_CHANGE | DATA_TYPE.PLAYER_REGISTER,
    playerData: RMPlayerData
  ): Response {
    const response: RMPlayer = {
      [PARAM.DATA_TYPE]: dataType,
      [PARAM.DATA]: playerData
    }
    return this.add(response);
  }

  addTableDataResponse(tableData: RMTableData): Response {
    const response: RMTable = {
      [PARAM.DATA_TYPE]: DATA_TYPE.TABLE_CHANGE,
      [PARAM.DATA]: tableData
    }
    return this.add(response);
  }

  addChairDataToResponse(chairData: RMChairData): Response {
    const response: RMChair = {
      [PARAM.DATA_TYPE]: DATA_TYPE.CHAIR_CHANGE,
      [PARAM.DATA]: chairData
    }
    return this.add(response);
  }
}