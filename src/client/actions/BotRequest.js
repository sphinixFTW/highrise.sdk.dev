'use strict';
const { HighrisejsError, ErrorCodes, HighriseTypeError } = require("../../errors");
const { generateRid, BodyParts, colorsIndexMinAndMax } = require("../../utils/Util");
const { defaultOutfit } = require("../../utils/Outfits");

const { SetOutfitRequest, SendPayloadWithoutResponse, BuyItemRequest, SendPayloadAndGetResponse, GetInventoryRequest, GetWalletRequest, BuyRoomBoostRequest, BuyVoiceTimeRequest } = require("../../utils/Models");

class Outfit {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
    this.paymentMethods = ["bot_wallet_only", "bot_wallet_priority", "user_wallet_only"];
  }

  async change(outfit) {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      if (!outfit) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'outfit');
      if (!Array.isArray(outfit) && outfit !== "default") throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'outfit', 'Array');

      let outfitToChange = outfit;
      if (!Array.isArray(outfit) && outfit.toLowerCase().trim() === "default") {
        outfitToChange = defaultOutfit;
      }

      const setOutfitRequest = new SetOutfitRequest(outfitToChange, this.rid);
      const payload = {
        _type: "SetOutfitRequest",
        ...setOutfitRequest
      }

      const sender = new SendPayloadWithoutResponse(this.bot);
      await sender.sendPayloadWithoutResponse(payload);

    } catch (error) {
      throw error;
    }
  }

  async color(bodyPart, index) {
    try {
      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      if (bodyPart === null || bodyPart === undefined) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'bodyPart');
      if (index === null || index === undefined) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'index');

      const BodyParts = {
        Hair: 'hair',
        Hair_Front: 'hair_front',
        Hair_Back: 'hair_back',
        Eyes: 'eye',
        Eyebrow: 'eyebrow',
        Lips: 'mouth',
        Skin: 'body'
      }

      // the bodyPart can be accessed using BodyParts.Hair, BodyParts.Eyes, etc.
      if (!Object.values(BodyParts).includes(bodyPart)) throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'bodyPart', 'string');
      if (typeof index !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'index', 'number');
      if (index < colorsIndexMinAndMax[bodyPart].min || index > colorsIndexMinAndMax[bodyPart].max) throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'index', `number between ${colorsIndexMinAndMax[bodyPart].min} and ${colorsIndexMinAndMax[bodyPart].max}`);

      let bodyPartsToChange = [];
      if (bodyPart === "hair") {
        bodyPartsToChange = [BodyParts.Hair_Front, BodyParts.Hair_Back];
      } else {
        bodyPartsToChange = [bodyPart];
      }

      const outfit = await this.bot.player.outfit.get(this.bot.info.user.id);
      const updatedOutfit = outfit.map(item => {
        if (!item) {
          return Promise.reject(new Error('Item does not exist'));
        }

        if (bodyPartsToChange.some(part => item.id.startsWith(`${part}-`))) {
          item.active_palette = index;
        }

        return item;
      });

      await this.change(updatedOutfit);
    } catch (error) {
      throw error;
    }
  }
}

class Item {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async buy(item_id) {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      if (!item_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'item_id');
      if (typeof item_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'item_id', 'string');

      const buyItemRequest = new BuyItemRequest(item_id, this.rid);
      const payload = {
        _type: "BuyItemRequest",
        ...buyItemRequest
      }

      const sender = new SendPayloadAndGetResponse(this.bot);
      const response = await sender.sendPayloadAndGetResponse(payload, BuyItemRequest.Response);

      return response.result.result;
    } catch (error) {
      throw error;
    }
  }
}

class Inventory {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async get() {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      const getInventoryRequest = new GetInventoryRequest(this.rid);

      const payload = {
        _type: "GetInventoryRequest",
        ...getInventoryRequest
      }

      const sender = new SendPayloadAndGetResponse(this.bot);
      const response = await sender.sendPayloadAndGetResponse(payload, GetInventoryRequest.Response);

      return response.items.items;

    } catch (error) {
      throw error;
    }
  }
}

class Wallet {
  constructor(bot) {
    this.bot = bot;
    this.rid = generateRid();
  }

  async get() {
    try {

      if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
      const getWalletRequest = new GetWalletRequest(this.rid);

      const payload = {
        _type: "GetWalletRequest",
        ...getWalletRequest
      }

      const sender = new SendPayloadAndGetResponse(this.bot);
      const response = await sender.sendPayloadAndGetResponse(payload, GetWalletRequest.Response);

      return response.content.content;

    } catch (error) {
      throw error;
    }
  }

  gold = {
    get: async () => {
      const wallet = await this.get();
      const gold = wallet.find(item => item.type === 'gold')?.amount || 0;
      return gold;
    }
  }

  boost = {
    get: async () => {
      const wallet = await this.get();
      const boost = wallet.find(item => item.type === 'room_boost_tokens')?.amount || 0;

      return boost;
    },

    buy: async (payment_method = 'bot_wallet_only', amount = 1) => {
      try {

        if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
        if (!payment_method) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'payment_method');
        if (!amount) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'amount');

        if (!this.paymentMethods.includes(payment_method)) throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'payment_method', 'string');
        if (typeof amount !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'amount', 'number');

        const buyRoomBoostRequest = new BuyRoomBoostRequest(payment_method, amount, this.rid);
        const payload = {
          _type: "BuyRoomBoostRequest",
          ...buyRoomBoostRequest
        }

        const sender = new SendPayloadAndGetResponse(this.bot);
        const response = await sender.sendPayloadAndGetResponse(payload, BuyRoomBoostRequest.Response);

        // return success or insufficent funds
        return response.result.result;

      } catch (error) {
        throw error;
      }
    }
  }

  voice = {
    get: async () => {
      const wallet = await this.get();
      const voice = wallet.find(item => item.type === 'room_voice_tokens')?.amount || 0;

      return voice;
    },

    buy: async (payment_method = 'bot_wallet_only', amount = 1) => {
      try {

        if (!this.bot.isWebSocketOpen()) throw new HighrisejsError(ErrorCodes.WebSocketNotOpen);
        if (!payment_method) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'payment_method');
        if (!amount) throw new HighriseTypeError(ErrorCodes.MissingParameters, 'amount');

        if (!this.paymentMethods.includes(payment_method)) throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'payment_method', 'string');
        if (typeof amount !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'amount', 'number');

        const buyVoiceTimeRequest = new BuyVoiceTimeRequest(payment_method, amount, this.rid);
        const payload = {
          _type: "BuyVoiceTimeRequest",
          ...buyVoiceTimeRequest
        }

        const sender = new SendPayloadAndGetResponse(this.bot);
        const response = await sender.sendPayloadAndGetResponse(payload, BuyVoiceTimeRequest.Response);

        // return success or insufficent funds
        return response.result.result;

      } catch (error) {
        throw error;
      }
    }
  }
}

module.exports = {
  Outfit,
  Item,
  Inventory,
  Wallet
}