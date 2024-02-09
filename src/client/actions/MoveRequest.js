'use strict';
const { ErrorCodes, HighrisejsError, HighriseTypeError } = require("../../errors");
const { generateRid } = require("../../utils/Rid");
const { Position, FloorHitRequest, SendPayloadWithoutResponse, AnchorPosition, AnchorHitRequest } = require("../../utils/Models");

class Move {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async walk(x, y, z, facing = 'FrontRight') {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      const validFacing = ['FrontRight', 'FrontLeft', 'BackRight', 'BackLeft'];

      if (x === undefined || x === null || y === undefined || y === null || z === undefined || z === null) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'x, y, z');
      if (!validFacing.includes(facing)) throw new HighriseTypeError(ErrorCodes.InvalidFacing, validFacing);

      if (typeof x !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidType, 'x', 'number');
      if (typeof y !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidType, 'y', 'number');
      if (typeof z !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidType, 'z', 'number');
      if (typeof facing !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidType, 'facing', 'string');

      const dest = new Position(x, y, z, facing);
      const floorHitRequest = new FloorHitRequest(dest, this.rid);

      const payload = {
        _type: 'FloorHitRequest',
        ...floorHitRequest
      }

      if (this.bot.Cache) {
        if (this.bot.info.user.id) {
          const position = { x: x, y: y, z: z, facing: facing }
          this.bot.room.cache.updateUserPosition(this.bot.info.user.id, position);
        }
      }

      const sendPayLoad = new SendPayloadWithoutResponse(this.bot);
      await sendPayLoad.sendPayloadWithoutResponse(payload);

    } catch (error) {
      throw error;
    }
  }

  async sit(entity_id, anchor_ix = 0) {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      if (!entity_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'entity_id');
      if (typeof entity_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidType, 'entity_id', 'string');

      const entityIDString = String(entity_id);
      const anchorIndex = parseInt(anchor_ix, 10);

      const dest = new AnchorPosition(entityIDString, anchorIndex);
      const anchorHitRequest = new AnchorHitRequest(dest, this.rid);

      const payload = {
        _type: 'AnchorHitRequest',
        ...anchorHitRequest
      }

      const sendPayLoad = new SendPayloadWithoutResponse(this.bot);
      await sendPayLoad.sendPayloadWithoutResponse(payload);

    } catch (error) {
      throw error
    }
  }
}

module.exports = Move;