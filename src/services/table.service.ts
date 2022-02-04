import { Injectable } from "@nestjs/common";
import { Table } from "../classes/table.class";
import { PlayerId } from "../models/types.model";

@Injectable()
export class TableService {
  private static readonly table: Table = new Table();

  static getTableInstance(): Table {
    return TableService.table;
  }

  static isPlayerOnChair(playerId: PlayerId): boolean {
    return TableService.table.isPlayerOnChair(playerId);
  }

  static isPlayerInQueue(playerId: PlayerId): boolean {
    return TableService.table.isPlayerInQueue(playerId);
  }

  static isPlayerOnTable(playerId: PlayerId): boolean {
    return TableService.isPlayerOnChair(playerId) || TableService.isPlayerInQueue(playerId);
  }

  static isPlayerReady(playerId: PlayerId): boolean {
    return TableService.table.isPlayerReady(playerId);
  }
}