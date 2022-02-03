import { Injectable } from "@nestjs/common";
import { Table } from "../classes/table.class";
import { PlayerId } from "../models/types.model";

@Injectable()
export class TableService {
  private static readonly table: Table = new Table();

  static getTableInstance(): Table {
    return TableService.table;
  }

  static isUserOnChair(playerId: PlayerId): boolean {
    return TableService.table.chair1.playerId === playerId || TableService.table.chair2.playerId === playerId;
  }

  static isUserReady(playerId: PlayerId): boolean {
    const table = TableService.table;
    return (table.chair1.playerId === playerId ? table.chair1 : table.chair2).isReady;
  }
}