import { ResponseModel, ResponseType } from "../models/response.model";
import { SocketService } from "../services/socket.service";

export class Response {
  private response: ResponseType = [];

  constructor() {}

  get(): ResponseType {
    return this.response
  }

  add(response: ResponseModel): Response {
    this.response.push(response);
    return this;
  }

  broadcast(): void {
    SocketService.broadcast(this.get());
  }
}