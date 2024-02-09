'use strict';
const { HighriseTypeError, ErrorCodes, HighrisejsError } = require("../../errors");
const { generateRid } = require("../../utils/Rid");
const { EmoteRequest, SendPayloadWithoutResponse, ReactionRequest, TipUserRequest, SendPayloadAndGetResponse, Position, TeleportRequest, MoveUserToRoomRequest, InviteSpeakerRequest, RemoveSpeakerRequest, ModerateRoomRequest, GetRoomPrivilegeRequest, GetUserOutfitRequest } = require("../../utils/Models");

class Users {

  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async emote(user_id = false, emote_id) {
    try {
      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);

      if (!user_id) user_id = this.bot.info.user.id; // If no user_id is provided, use the bot's user_id
      if (!emote_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'emote_id');

      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');
      if (typeof emote_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'emote_id', 'string');

      const emoteRequest = new EmoteRequest(user_id, emote_id, this.rid);
      const payload = {
        _type: 'EmoteRequest',
        ...emoteRequest
      };

      const sendPayLoad = new SendPayloadWithoutResponse(this.bot);
      await sendPayLoad.sendPayloadWithoutResponse(payload);
    } catch (error) {
      throw error;
    }
  }

  async react(user_id, reaction_id) {
    try {
      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (!reaction_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'reaction_id');

      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');
      if (typeof reaction_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'reaction_id', 'string');

      if (user_id && user_id === this.bot.info.user.id) throw new HighrisejsError(ErrorCodes.AccessDenied, 'user_id', 'another user\'s');
      const reactions = ['clap', 'heart', 'thumbs', 'wave', 'wink'];
      if (!reactions.includes(reaction_id)) throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'reaction_id', 'clap, heart, thumbs, wave, wink');

      const reactionRequest = new ReactionRequest(user_id, reaction_id, this.rid);
      const payload = {
        _type: 'ReactionRequest',
        ...reactionRequest
      };

      const sendPayLoad = new SendPayloadWithoutResponse(this.bot);
      await sendPayLoad.sendPayloadWithoutResponse(payload);
    } catch (error) {
      throw error;
    }
  }

  async tip(user_id, amount) {
    try {

      const BARS = {
        1: 'gold_bar_1',
        5: 'gold_bar_5',
        10: 'gold_bar_10',
        50: 'gold_bar_50',
        100: 'gold_bar_100',
        500: 'gold_bar_500',
        1000: 'gold_bar_1k',
        5000: 'gold_bar_5000',
        10000: 'gold_bar_10k'
      }

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (!amount) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'amount');

      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');
      if (typeof amount !== "number") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'amount', 'number');

      if (user_id && user_id === this.bot.info.user.id) throw new HighrisejsError(ErrorCodes.AccessDenied, 'user_id', 'another user\'s');

      const tipUserRequest = new TipUserRequest(user_id, BARS[amount], this.rid);
      const payload = {
        _type: 'TipUserRequest',
        ...tipUserRequest
      }

      const sender = new SendPayloadAndGetResponse(this.bot);
      const response = await sender.sendPayloadAndGetResponse(payload, TipUserRequest.Response);

      return response.result.result;

    } catch (error) {
      throw error;
    }
  }

  async teleport(user_id, x, y, z, facing = "FrontRight") {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);

      const validFacing = ['BackLeft', 'BackRight', 'FrontLeft', 'FrontRight'];

      if (!user_id) user_id = this.bot.info.user.id; // If no user_id is provided, use the bot's user_id
      if (x === undefined || x === null || y === undefined || y === null || z === undefined || z === null) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'x, y, z');
      if (!validFacing.includes(facing)) throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'facing', 'BackLeft, BackRight, FrontLeft, FrontRight');

      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');
      if (typeof x !== "number") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'x', 'number');
      if (typeof y !== "number") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'y', 'number');
      if (typeof z !== "number") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'z', 'number');
      if (typeof facing !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'facing', 'string');

      const dest = new Position(x, y, z, facing);
      const teleportRequest = new TeleportRequest(user_id, dest, this.rid);
      const request = {
        _type: 'TeleportRequest',
        ...teleportRequest
      }

      if (this.bot.Cache) {
        const position = { x: x, y: y, z: z, facing: facing }
        this.bot.room.cache.updateUserPosition(user_id, position);
      }

      const sendPayLoad = new SendPayloadWithoutResponse(this.bot);
      await sendPayLoad.sendPayloadWithoutResponse(request);

    } catch (error) {
      throw error;
    }
  }

  async transport(user_id, room_id) {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (!room_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'room_id');

      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');
      if (typeof room_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'room_id', 'string');

      const transportRequest = new MoveUserToRoomRequest(user_id, room_id, this.rid);
      const request = {
        _type: 'MoveUserToRoomRequest',
        ...transportRequest
      };

      const sendPayLoad = new SendPayloadWithoutResponse(this.bot);
      await sendPayLoad.sendPayloadWithoutResponse(request);

    } catch (error) {
      throw error;
    }
  }

  voice = {
    add: async (user_id) => {
      try {

        if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
        if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
        if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');

        const addVoiceRequest = new InviteSpeakerRequest(user_id, this.rid);
        const request = {
          _type: 'InviteSpeakerRequest',
          ...addVoiceRequest
        }

        const sendPayLoad = new SendPayloadWithoutResponse(this.bot);
        await sendPayLoad.sendPayloadWithoutResponse(request);

      } catch (error) {
        throw error;
      }
    },

    remove: async (user_id) => {
      try {

        if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
        if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
        if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');

        const removeVoiceRequest = new RemoveSpeakerRequest(user_id, this.rid);
        const request = {
          _type: 'RemoveSpeakerRequest',
          ...removeVoiceRequest
        }

        const sendPayLoad = new SendPayloadWithoutResponse(this.bot);
        await sendPayLoad.sendPayloadWithoutResponse(request);

      } catch (error) {
        throw error;
      }
    }
  }

  async moderateRoom(request) {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      const payload = {
        _type: 'ModerateRoomRequest',
        ...request
      }

      const sendPayLoad = new SendPayloadWithoutResponse(this.bot);
      await sendPayLoad.sendPayloadWithoutResponse(payload);

    } catch (error) {
      throw error;
    }
  }

  async kick(user_id) {
    try {

      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');

      await this.moderateRoom(new ModerateRoomRequest(user_id, 'kick', null, this.rid));

    } catch (error) {
      throw error;
    }
  }

  async ban(user_id, seconds) {
    try {

      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (!seconds) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'seconds');

      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');
      if (typeof seconds !== "number") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'seconds', 'number');

      await this.moderateRoom(new ModerateRoomRequest(user_id, 'ban', seconds, this.rid));

    } catch (error) {
      throw error;
    }
  }

  async mute(user_id, seconds) {
    try {

      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (!seconds) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'seconds');

      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');
      if (typeof seconds !== "number") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'seconds', 'number');

      await this.moderateRoom(new ModerateRoomRequest(user_id, 'mute', seconds, this.rid));

    } catch (error) {
      throw error;
    }
  }

  async unban(user_id) {
    try {

      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');

      await this.moderateRoom(new ModerateRoomRequest(user_id, 'unban', null, this.rid));

    } catch (error) {
      throw error;
    }
  }

  async unmute(user_id) {
    try {

      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');

      await this.moderateRoom(new ModerateRoomRequest(user_id, 'mute', 1, this.rid));

    } catch (error) {
      throw error;
    }
  }

  async changePlayerPrivileges(user_id, permissions) {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      const payload = {
        _type: 'ChangeRoomPrivilegeRequest',
        user_id: user_id,
        permissions: permissions,
        rid: this.rid
      }

      const sendPayLoad = new SendPayloadWithoutResponse(this.bot);
      await sendPayLoad.sendPayloadWithoutResponse(payload);

    } catch (error) {
      throw error;
    }
  }

  permissions = {
    get: async (user_id) => {
      try {

        if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
        if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
        if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');

        const getPlayerPrivilegesRequest = new GetRoomPrivilegeRequest(user_id, this.rid);
        const payload = {
          _type: 'GetRoomPrivilegeRequest',
          ...getPlayerPrivilegesRequest
        }

        const sender = new SendPayloadAndGetResponse(this.bot);
        const response = await sender.sendPayloadAndGetResponse(payload, GetRoomPrivilegeRequest.Response);

        return response.content.content;

      } catch (error) {
        throw error;
      }
    }
  }

  moderator = {
    add: async (user_id) => {
      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');

      const permissions = { moderator: true };
      await this.changePlayerPrivileges(user_id, permissions);
    },

    remove: async (user_id) => {
      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');

      const permissions = { moderator: false };
      await this.changePlayerPrivileges(user_id, permissions);
    }
  }

  designer = {
    add: async (user_id) => {
      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');

      const permissions = { designer: true };
      await this.changePlayerPrivileges(user_id, permissions);
    },

    remove: async (user_id) => {
      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'user_id');
      if (typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');

      const permissions = { designer: false };
      await this.changePlayerPrivileges(user_id, permissions);
    }
  }

  outfit = {
    get: async (user_id) => {
      try {

        if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
        if (!user_id) user_id = this.bot.info.user.id; // If no user_id is provided, use the bot's user_id

        if (user_id && typeof user_id !== "string") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'user_id', 'string');
        const getUserOutfitRequest = new GetUserOutfitRequest(user_id, this.rid);
        const payload = {
          _type: 'GetUserOutfitRequest',
          ...getUserOutfitRequest
        }

        const sender = new SendPayloadAndGetResponse(this.bot);
        const response = await sender.sendPayloadAndGetResponse(payload, GetUserOutfitRequest.Response);

        return response.outfit.outfit;
      } catch (error) {
        throw error;
      }
    }
  }

}

module.exports = Users;