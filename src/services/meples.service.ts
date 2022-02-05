import { Injectable } from "@nestjs/common";
import { Meple } from "../classes/meple.class";
import { MEPLE_ID } from "../models/meple.model";
import { CHAIR_ID } from "../models/chair.model";

@Injectable()
export class MeplesService {
  private static instance: MeplesService;
  private meples: Meple[] = [
    new Meple(MEPLE_ID.ID1),
    new Meple(MEPLE_ID.ID2)
  ]

  constructor() {
    MeplesService.instance = this;
  }

  static getInstance(): MeplesService {
    return this.instance;
  }

  getMeple(mepleId: MEPLE_ID | CHAIR_ID): Meple {
    return this.meples[mepleId];
  }
}