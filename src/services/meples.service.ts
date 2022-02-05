import { Injectable } from "@nestjs/common";
import { Meple } from "../classes/meple.class";
import { GENERAL_ID } from "../models/types.model";

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
}