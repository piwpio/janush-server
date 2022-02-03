import { RMPlayerChangeData } from "../models/response.model";
import { PlayerData, PROPERTY_TO_PARAMP } from "../models/player.model";
import { Socket } from "socket.io";
import { PARAM } from "../models/param.model";

export class Player {
  public socket: Socket;
  public id: string;

  public isDirty = false;
  public dirtyData: PlayerData = {};

  // properties
  public name = '';

  constructor(socket) {
    this.socket = socket;
    this.id = socket.id;
    // Set isDirty everytime when property has changed
    return new Proxy(this, {
      set: (player, field, value) => {
        player[field] = value;
        if (field === 'id' || field === 'socket') return true;

        player.dirtyData[PROPERTY_TO_PARAMP[field]] = value;
        player.isDirty = true
        return true;
      }
    });
  }

  getData(): RMPlayerChangeData {
    return {
      [PARAM.PLAYER_ID]: this.id,
      [PARAM.NAME]: this.name
    }
  }

  getDirtyData(): RMPlayerChangeData {
    if (!this.isDirty) return;

    let dirtyData = {[PARAM.PLAYER_ID]: this.id, ...this.dirtyData};
    this.isDirty = false;
    this.dirtyData = {};
    return dirtyData;
  }
}