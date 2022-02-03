import { ResponseModel, ResponseType } from "../models/response.model";

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
}