import { ResponseModel, ResponseType } from "../models/response.model";
import { SocketService } from "../services/socket.service";

export class Response {
  private response: ResponseType = [];

  get(): ResponseType {
    return this.response
  }

  add(response: ResponseModel): void {
    this.response.push(response);
  }

  broadcast(): void {
    SocketService.broadcast(this.response);
  }
}