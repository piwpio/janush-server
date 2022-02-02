import { SocketService } from "../services/socket.service";
import { DATA_KEY, DATA_PARAM, DataSModel } from "../models/data.model";

export class Player {
  public isDirty = false;
  public dirtyData: DataSModel = {};

  public id;
  public socket;
  public name = 'Noob';

  constructor(socket) {
    this.socket = socket;
    this.id = socket.id;
    // Set isDirty everytime when property has changed
    return new Proxy(this, {
      set: (player, field, value) => {
        player[field] = value;
        player.dirtyData[field] = value;
        player.isDirty = true
        return true;
      }
    });
  }

  brodcastChanges(): void {
    if (!this.isDirty) return;

    SocketService.broadcast(DATA_KEY.PLAYER_CHANGE, this.dirtyData);
    this.isDirty = false;
    this.dirtyData = {};
  }
}