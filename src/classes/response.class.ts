import { ResponseModel, ResponseType, RMPlayerChangeData } from "../models/response.model";

import { DATA_TYPE, PARAM } from "../models/param.model";

export class Response {
  private response: ResponseType = [];

  constructor() {}

  get(): ResponseType {
    return [...this.response]
  }

  private add(response: ResponseModel): Response {
    this.response.push(response);
    return this;
  }

  addPlayerDataResponse(dataType: DATA_TYPE.PLAYER_CHANGE | DATA_TYPE.REGISTER_PLAYER,
                        playerData: RMPlayerChangeData): Response
  {
    const response = {
      [PARAM.DATA_TYPE]: dataType,
      [PARAM.DATA]: playerData
    }
    this.add(response);
    return this;
  }
}