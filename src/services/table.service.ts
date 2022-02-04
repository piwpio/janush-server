import { Injectable } from "@nestjs/common";
import { Table } from "../classes/table.class";
import { PlayerId } from "../models/types.model";
import { Response } from "../classes/response.class";
import { PlayerData } from "../models/player.model";
import { RMChairChange, RMTableChange } from "../models/response.model";

@Injectable()
export class TableService {
  private static readonly table: Table = new Table();

  static getTableInstance(): Table {
    return this.table;
  }

  static isPlayerOnChair(playerId: PlayerId): boolean {
    return this.table.isPlayerOnChair(playerId);
  }

  static isPlayerInQueue(playerId: PlayerId): boolean {
    return this.table.isPlayerInQueue(playerId);
  }

  static isPlayerOnTable(playerId: PlayerId): boolean {
    return this.isPlayerOnChair(playerId) || this.isPlayerInQueue(playerId);
  }

  static isPlayerReady(playerId: PlayerId): boolean {
    return this.table.isPlayerReady(playerId);
  }

  static getTableData(): [RMTableChange, RMChairChange, RMChairChange] {
    return this.table.getTableInitData();
  }
}