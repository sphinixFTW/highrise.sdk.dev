'use strict';

const { ErrorCodes, HighrisejsError } = require("../../errors");
const { generateRid } = require("../../utils/Rid");
const { CheckVoiceChatRequest, SendPayloadAndGetResponse } = require("../../utils/Models");

class VoiceChat {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async fetch() {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      const checkVoiceChatRequest = new CheckVoiceChatRequest(this.id);
      const payload = {
        _type: 'CheckVoiceChatRequest',
        ...checkVoiceChatRequest
      };

      const sender = new SendPayloadAndGetResponse(this.bot);
      const response = await sender.sendPayloadAndGetResponse(payload, CheckVoiceChatRequest.Response);

      const { seconds_left, auto_speakers, users } = response.seconds_left;
      return { seconds_left, auto_speakers, users };

    } catch (error) {
      throw error
    }
  }

  get = {
    seconds: async () => {
      const { seconds_left } = await this.fetch();
      return seconds_left;
    },
    auto_speakers: async () => {
      const { auto_speakers } = await this.fetch();
      return auto_speakers;
    },
    active: async () => {
      const { users } = await this.fetch();
      return Object.entries(users)
        .filter(([userId, status]) => status === 'voice')
        .map(([userId]) => userId);
    },
    muted: async () => {
      const { users } = await this.fetch();
      return Object.entries(users)
        .filter(([userId, status]) => status === 'muted')
        .map(([userId]) => userId);
    }
  }
}

module.exports = VoiceChat;