import { RMPlayerData } from "../models/response.model";
import { PlayerData } from "../models/player.model";
import { Socket } from "socket.io";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { PlayerId } from "../models/types.model";
import { Response } from "./response.class";

export class Player {
  public readonly socket: Socket;
  public readonly id: PlayerId;

  public dirtyData: PlayerData = {};

  // properties
  public readonly name = '';

  constructor(socket, name) {
    this.socket = socket;
    this.id = socket.id;
    this.name = name;
  }

  addPlayerToResponse(
    response: Response,
    dataType: DATA_TYPE.PLAYER_CHANGE | DATA_TYPE.PLAYER_REGISTER = DATA_TYPE.PLAYER_REGISTER
  ): void {
    response.addPlayerDataResponse(dataType, this.getData());
  }

  getData(): RMPlayerData {
    return {
      [PARAM.PLAYER_ID]: this.id,
      [PARAM.PLAYER_NAME]: this.name
    }
  }
}