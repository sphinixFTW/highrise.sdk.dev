'use strict';

const { HighriseTypeError, ErrorCodes, HighrisejsError } = require("../../errors");
const { generateRid } = require("../../utils/Util");
const { ChatRequest, SendPayloadWithoutResponse } = require("../../utils/Models");

class PublicMessage {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async send(message) {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      if (!message) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'message');
      if (typeof message !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'message', 'string');

      const chatRequest = new ChatRequest(message, null, this.rid);
      const payload = {
        _type: "ChatRequest",
        ...chatRequest
      }

      const sender = new SendPayloadWithoutResponse(this.bot);
      await sender.sendPayloadWithoutResponse(payload);

    } catch (error) {
      throw error;
    }
  }
}

class WhisperMessage {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async send(user_id, message) {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);

      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (!message) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'message');

      if (user_id === this.bot.info.user.id) throw new HighriseTypeError(ErrorCodes.AccessDenied, 'user_id', 'another user\'s');
      if (typeof user_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');
      if (typeof message !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'message', 'string');

      const chatRequest = new ChatRequest(message, user_id, this.rid);
      const payload = {
        _type: "ChatRequest",
        ...chatRequest
      }

      const sender = new SendPayloadWithoutResponse(this.bot);
      await sender.sendPayloadWithoutResponse(payload);

    } catch (error) {
      throw error;
    }
  }
}

class Invite {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async send(conversation_id, room_id) {
    try {


      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      if (!conversation_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'conversation_id');
      if (!room_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'room_id');

      if (typeof conversation_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'conversation_id', 'string');
      if (typeof room_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'room_id', 'string');

      const payload = {
        _type: 'SendMessageRequest',
        conversation_id: conversation_id,
        content: '',
        type: 'invite',
        room_id: room_id,
        rid: this.rid
      };

      const sender = new SendPayloadWithoutResponse(this.bot);
      await sender.sendPayloadWithoutResponse(payload);

    } catch (error) {
      throw error;
    }
  }
}

class DirectMessage {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async send(conversation_id, message) {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      if (!conversation_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'conversation_id');
      if (!message) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'message');

      if (typeof conversation_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'conversation_id', 'string');
      if (typeof message !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'message', 'string');

      const payload = {
        _type: 'SendMessageRequest',
        conversation_id: conversation_id,
        content: message,
        type: 'text',
        room_id: null,
        rid: this.rid
      };

      const sender = new SendPayloadWithoutResponse(this.bot);
      await sender.sendPayloadWithoutResponse(payload);

    } catch (error) {
      throw error;
    }
  }
}


module.exports = {
  PublicMessage,
  WhisperMessage,
  Invite,
  DirectMessage
}