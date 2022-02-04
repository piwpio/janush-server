import { Injectable } from "@nestjs/common";
import { Chair } from "../classes/chair.class";
import { CHAIR_ID } from "../models/chair.model";
import { PlayerId } from "../models/types.model";
import { RMChairChange } from "../models/response.model";

@Injectable()
export class ChairsService {
  private readonly chairs: Chair[] = [
    new Chair(CHAIR_ID.ID1),
    new Chair(CHAIR_ID.ID2)
  ]

  getChair(chairId: CHAIR_ID): Chair {
    return this.chairs[chairId];
  }

  getPlayerChair(playerId: PlayerId): Chair {
    if (this.chairs[CHAIR_ID.ID1].playerId === playerId)
      return this.chairs[CHAIR_ID.ID1];
    else if (this.chairs[CHAIR_ID.ID2].playerId === playerId)
      return this.chairs[CHAIR_ID.ID2];

    return null
  }

  getOppositePlayerChair(playerId: PlayerId): Chair {
    if (this.chairs[CHAIR_ID.ID1].playerId === playerId)
      return this.chairs[CHAIR_ID.ID2];
    else if (this.chairs[CHAIR_ID.ID2].playerId === playerId)
      return this.chairs[CHAIR_ID.ID1];

    return null
  }

  isPlayerOnChair(playerId: PlayerId): boolean {
    return !!this.getPlayerChair(playerId);
  }

  isPlayerReady(playerId: PlayerId): boolean {
    const playerChair = this.getPlayerChair(playerId);
    if (playerChair)
      return playerChair.isReady;
    else
      return false
  }

  getChairsResponse(): [RMChairChange, RMChairChange] {
    return [this.chairs[CHAIR_ID.ID1].getResponse(), this.chairs[CHAIR_ID.ID2].getResponse()]
  }
}