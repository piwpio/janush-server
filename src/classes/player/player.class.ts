import { SocketService } from "../../services/socket.service";
import { DATA_KEY } from "../../models/data.model";

export class Player {
  public isDirty = false;

  public socket;
  public name = 'Noob';

  constructor(socket) {
    this.socket = socket;
    // Set isDirty everytime when property has changed
    return new Proxy(this, {
      set: (player, field, value) => {
        player[field] = value;
        player.isDirty = true
        return true;
      }
    });
  }

  getSocket(): any {
    return this.socket;
  }
}