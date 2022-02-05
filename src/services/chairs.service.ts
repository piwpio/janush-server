import { Injectable } from "@nestjs/common";
import { Chair } from "../classes/chair.class";
import { GENERAL_ID, PlayerId } from "../models/types.model";
import { RMChairChange } from "../models/response.model";

@Injectable()
export class ChairsService {
  private static instance: ChairsService;
  private readonly chairs: Chair[] = [
    new Chair(GENERAL_ID.ID1),
    new Chair(GENERAL_ID.ID2)
  ]

  constructor() {
    ChairsService.instance = this;
  }

  static getInstance(): ChairsService {
    return this.instance;
  }

  getChair(chairId: GENERAL_ID): Chair {
    return this.chairs[chairId];
  }

  getOppositeChair(chair: Chair): Chair {
    return this.chairs[chair.id === GENERAL_ID.ID1 ? GENERAL_ID.ID2 : GENERAL_ID.ID1];
  }

  getPlayerChair(playerId: PlayerId): Chair {
    if (this.chairs[GENERAL_ID.ID1].playerId === playerId)
      return this.chairs[GENERAL_ID.ID1];
    else if (this.chairs[GENERAL_ID.ID2].playerId === playerId)
      return this.chairs[GENERAL_ID.ID2];

    return null
  }

  getOppositePlayerChair(playerId: PlayerId): Chair {
    if (this.chairs[GENERAL_ID.ID1].playerId === playerId)
      return this.chairs[GENERAL_ID.ID2];
    else if (this.chairs[GENERAL_ID.ID2].playerId === playerId)
      return this.chairs[GENERAL_ID.ID1];

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
    return [this.chairs[GENERAL_ID.ID1].getResponse(), this.chairs[GENERAL_ID.ID2].getResponse()]
  }
}