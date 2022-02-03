import { RMPlayerChange } from "../models/response.model";
import { Socket } from "socket.io";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { PlayerId } from "../models/types.model";
import { Response } from "./response.class";
import { PlayerData, PlayerFullData } from "../models/player.model";

export class Player {
  public readonly socket: Socket;
  public readonly id: PlayerId;

  // properties
  public readonly name = '';
  public winstreak = 0;

  constructor(socket, name) {
    this.socket = socket;
    this.id = socket.id;
    this.name = name;
  }

  afterRegister(response: Response): void {
    response.add({
      [PARAM.DATA_TYPE]: DATA_TYPE.PLAYER_REGISTER,
      [PARAM.DATA]: this.getDataFull()
    });
  }

  getDataFull(): PlayerFullData {
    return {
      [PARAM.PLAYER_ID]: this.id,
      [PARAM.PLAYER_NAME]: this.name,
      [PARAM.PLAYER_WINSTREAK]: this.winstreak
    }
  }

  getDataForQueue(): PlayerData {
    return {
      [PARAM.PLAYER_ID]: this.id,
      [PARAM.PLAYER_NAME]: this.name
    }
  }

  getDataForChair(): PlayerData {
    return {
      [PARAM.PLAYER_ID]: this.id,
      [PARAM.PLAYER_NAME]: this.name
    }
  }

  getDataForEndGame(): PlayerData {
    return {
      [PARAM.PLAYER_ID]: this.id,
      [PARAM.PLAYER_NAME]: this.name,
      [PARAM.PLAYER_WINSTREAK]: this.winstreak
    }
  }
}