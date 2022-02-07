import { Injectable } from "@nestjs/common";
import { Meple } from "../classes/meple.class";
import { GENERAL_ID } from "../models/types.model";
import { Chair } from "../classes/chair.class";

@Injectable()
export class MeplesService {
  private static instance: MeplesService;
  private meples: Meple[] = [
    new Meple(GENERAL_ID.ID1),
    new Meple(GENERAL_ID.ID2)
  ]

  constructor() {
    MeplesService.instance = this;
  }

  static getInstance(): MeplesService {
    return this.instance;
  }

  getMeple(mepleId: GENERAL_ID): Meple {
    return this.meples[mepleId];
  }

  getOppositeMeple(meple: Meple): Meple {
    return this.meples[meple.id === GENERAL_ID.ID1 ? GENERAL_ID.ID2 : GENERAL_ID.ID1];
  }
}