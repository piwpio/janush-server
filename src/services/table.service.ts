import { Injectable } from "@nestjs/common";
import { Table } from "../classes/table.class";
import { PlayerId } from "../models/types.model";
import { RMTableChange } from "../models/response.model";

@Injectable()
export class TableService {
  private static instance: TableService;
  private readonly table: Table = new Table();

  constructor() {
    TableService.instance = this;
  }

  static getInstance(): TableService {
    return this.instance;
  }

  getTable(): Table {
    return this.table;
  }

  isPlayerInQueue(playerId: PlayerId): boolean {
    return this.table.isPlayerInQueue(playerId);
  }

  getTableResponse(): RMTableChange {
    return this.table.getResponse();
  }
}