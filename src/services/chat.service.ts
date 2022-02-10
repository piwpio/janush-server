import { Injectable } from "@nestjs/common";
import { PlayersService } from "./players.service";
import { Response } from "../classes/response.class";
import { RMChatChange } from "../models/response.model";
import { DATA_TYPE, PARAM } from "../models/param.model";
import { CHAT_SYSTEM } from "../models/types.model";

@Injectable()
export class ChatService {
  constructor(
    private playersService: PlayersService,
  ) {}

  getChatInitResponse(): RMChatChange {
    const playersName = this.playersService.getPlayers()
      .map(player => player.name).join(', ');
    return {
      [PARAM.DATA_TYPE]: DATA_TYPE.CHAT_CHANGE,
      [PARAM.DATA]: {
        [PARAM.CHAT_PLAYER_NAME]: CHAT_SYSTEM,
        [PARAM.CHAT_MESSAGE]: `In game: ${playersName}` || 'No one in game'
      }
    }
  }

  addMessageToResponse(response: Response, message: string, name?: string): void {
    response.add({
      [PARAM.DATA_TYPE]: DATA_TYPE.CHAT_CHANGE,
      [PARAM.DATA]: {
        [PARAM.CHAT_PLAYER_NAME]: name ?? CHAT_SYSTEM,
        [PARAM.CHAT_MESSAGE]: message
      }
    });
  }
}
