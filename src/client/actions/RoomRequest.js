'use strict';
const { HighrisejsError, ErrorCodes, HighriseTypeError } = require("../../errors");
const { generateRid } = require("../../utils/Rid");
const { GetRoomUsersRequest, SendPayloadAndGetResponse } = require("../../utils/Models");

class Room {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async get() {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);

      const getRoomUsersRequest = new GetRoomUsersRequest(this.rid);
      const payload = {
        _type: "GetRoomUsersRequest",
        rid: getRoomUsersRequest.rid,
        content: getRoomUsersRequest.content
      };

      const sender = new SendPayloadAndGetResponse(this.bot);
      const response = await sender.sendPayloadAndGetResponse(payload, GetRoomUsersRequest.Response);

      return response.content.content

    } catch (error) {
      throw error;
    }
  }

  async position(user_id) {
    try {

      const users = await this.get();
      if (!users) return null;

      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, "user_id");
      if (typeof user_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, "user_id", "string");

      const user = users.find(u => u[0].id === user_id);
      if (!user) return null;

      return user[1];

    } catch (error) {
      throw error;
    }
  }

  async id(username) {
    try {

      const users = await this.get();
      if (!users) return null;

      if (!username) throw new HighriseTypeError(ErrorCodes.MissingParameters, "username");
      if (typeof username !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, "username", "string");

      const user = users.find(u => u[0].username?.toLowerCase() === username.toLowerCase());
      if (!user) return null;

      return user[0].id;

    } catch (error) {
      throw error;
    }
  }

  async username(user_id) {
    try {

      const users = await this.get();
      if (!users) return null;

      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, "user_id");
      if (typeof user_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, "user_id", "string");

      const user = users.find(u => u[0].id === user_id);
      if (!user) return null;

      return user[0].username;

    } catch (error) {
      throw error;
    }
  }
}

module.exports = Room;