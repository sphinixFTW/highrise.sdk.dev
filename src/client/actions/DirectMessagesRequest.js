'use strict';
const { HighriseTypeError, ErrorCodes, HighrisejsError } = require("../../errors");
const { generateRid } = require("../../utils/Rid");
const { GetConversationsRequest, SendPayloadAndGetResponse, GetMessagesRequest, LeaveConversationRequest, SendPayloadWithoutResponse } = require("../../utils/Models");

class DirectMessages {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  conversations = {
    get: async (not_joined = false, last_id = null) => {
      try {

        if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);

        if (not_joined && typeof not_joined !== 'boolean') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'not_joined', 'boolean');
        if (last_id && typeof last_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'last_id', 'string');

        const getDirectMessageRequest = new GetConversationsRequest(not_joined, last_id, this.rid);
        const payload = {
          _type: "GetConversationsRequest",
          ...getDirectMessageRequest
        }

        const sender = new SendPayloadAndGetResponse(this.bot);
        const response = await sender.sendPayloadAndGetResponse(payload, GetConversationsRequest.Response);

        return response.conversations.conversations;

      } catch (error) {
        throw error;
      }
    }
  }

  messages = {
    get: async (conversation_id, last_message_id = null) => {
      try {

        if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);

        if (!conversation_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'conversation_id');
        if (typeof conversation_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'conversation_id', 'string');
        if (last_message_id && typeof last_message_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'last_message_id', 'string');

        const getMessagesReuqest = new GetMessagesRequest(conversation_id, last_message_id, this.rid);
        const payload = {
          _type: "GetMessagesRequest",
          ...getMessagesReuqest
        }

        const sender = new SendPayloadAndGetResponse(this.bot);
        const response = await sender.sendPayloadAndGetResponse(payload, GetMessagesRequest.Response);

        return response.messages.messages;

      } catch (error) {
        throw error;
      }
    }
  }

  async leave(conversation_id) {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);

      if (!conversation_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'conversation_id');
      if (typeof conversation_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'conversation_id', 'string');

      const leaveConversationRequest = new LeaveConversationRequest(conversation_id, this.rid);
      const payload = {
        _type: 'LeaveConversationRequest',
        ...leaveConversationRequest
      }

      const sendPayLoad = new SendPayloadWithoutResponse(this.bot);
      await sendPayLoad.sendPayloadWithoutResponse(payload);

    } catch (error) {
      throw error;
    }
  }

}

module.exports = DirectMessages;