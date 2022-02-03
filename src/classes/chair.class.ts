import { PlayerId } from "../models/types.model";

export class Chair {
  public playerId: PlayerId = null;
  public isBusy = false;
  public isReady = false;

  sitOn(playerId: PlayerId): void {
    this.playerId = playerId;
    this.isBusy = true;
  }

  standUp(): void {
    this.reset();
  }

  reset(): void {
    this.playerId = null;
    this.isBusy = false;
    this.isReady = false;
  }
}