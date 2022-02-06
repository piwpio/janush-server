import { Socket } from "socket.io";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { PlayerId } from "../models/types.model";
import { Response } from "./response.class";
import { PlayerData, PlayerFullData } from "../models/player.model";

export class Player {
  public socket: Socket;
  public readonly id: PlayerId;

  // properties
  public readonly name = '';
  public winCounter = 0;
  public lostCounter = 0;
  public winStreak = 0;
  public maxWinStreak = 0;

  constructor(socket, name) {
    this.socket = socket;
    this.id = socket.id;
    this.name = name;
  }

  setAfterGameWon(response: Response): void {
    ++this.winCounter
    ++this.winStreak;
    this.maxWinStreak = Math.max(this.winStreak, this.maxWinStreak);
    this.addResponseAfterPlayerChange(response);
  }

  setAfterGameLost(response: Response): void {
    ++this.lostCounter;
    this.winStreak = 0;
    this.addResponseAfterPlayerChange(response);
  }

  addResponseAfterPlayerChange(response: Response): void {
    response.add({
      [PARAM.DATA_TYPE]: DATA_TYPE.PLAYER_CHANGE,
      [PARAM.DATA]: this.getDataFull()
    });  }

  addResponseAfterRegister(response: Response): void {
    response.add({
      [PARAM.DATA_TYPE]: DATA_TYPE.PLAYER_REGISTER,
      [PARAM.DATA]: this.getDataFull()
    });
  }

  addResponseAfterUnRegister(response: Response): void {
    response.add({
      [PARAM.DATA_TYPE]: DATA_TYPE.PLAYER_UNREGISTER,
      [PARAM.DATA]: this.getDataFull()
    });
  }

  getDataFull(): PlayerFullData {
    return {
      [PARAM.PLAYER_ID]: this.id,
      [PARAM.PLAYER_NAME]: this.name,
      [PARAM.PLAYER_WINSTREAK]: this.winStreak,
      [PARAM.PLAYER_MAX_WINSTREAK]: this.maxWinStreak,
      [PARAM.PLAYER_WIN_COUNTER]: this.winCounter,
      [PARAM.PLAYER_LOST_COUNTER]: this.lostCounter
    }
  }

  getDataForQueue(): PlayerData {
    return this.getDataFull();
  }

  getDataForChair(): PlayerData {
    return this.getDataFull();
  }

  getDataForEndGame(): PlayerFullData {
    return this.getDataFull();
  }
}