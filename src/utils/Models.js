const { generateRid } = require("../utils/Rid");
const { packageVersion } = require("../utils/Package");
const { HighrisejsError, ErrorCodes } = require("../errors");


class SessionMetadata {
  /**
   * Initial session data.
   * @param {string} user_id - The bot's user ID.
   * @param {RoomInfo} room_info - Additional information about the connected room.
   * @param {Object.<string, [number, number]>} rate_limits - A dictionary of rate limits,
   *                                                        with the key as the rate limit name
   *                                                        and the value as a tuple of (limit, period).
   * @param {string} connection_id - The connection ID of the WebSocket used in the bot connection.
   * @param {string|null} sdk_version - The SDK version recommended by the server (if applicable).
   */
  constructor(user_id, room_info, rate_limits, connection_id, sdk_version = packageVersion()) {
    this.user_id = user_id;
    this.room_info = room_info;
    this.rate_limits = rate_limits;
    this.connection_id = connection_id;
    this.sdk_version = sdk_version;
  }
}

class RoomInfo {
  /**
   * Information about the room.
   * @param {string} owner_id - The ID of the room owner.
   * @param {string} room_name - The name of the room.
   */
  constructor(owner_id, room_name) {
    this.owner_id = owner_id;
    this.room_name = room_name;
  }
}

class User {
  /**
   * User class representing a user in the game.
   * @param {string} id - The user's ID.
   * @param {string} username - The user's username.
   */
  constructor(id, username) {
    this.id = id;
    this.username = username;
  }
}

class Position {
  /**
   * Position class representing a position in 3D space.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {number} z - The z-coordinate.
   * @param {string} facing - The direction the entity is facing. Defaults to "FrontRight".
   */
  constructor(x, y, z, facing = "FrontRight") {
    this.x = x;
    this.y = y;
    this.z = z;
    this.facing = facing;
  }
}

class AnchorPosition {
  /**
   * Constructor for an AnchorPosition object.
   * 
   * @param {string} entity_id - The ID of the entity.
   * @param {number} anchor_ix - The index of the anchor.
   */
  constructor(entity_id, anchor_ix) {
    this.entity_id = entity_id;
    this.anchor_ix = anchor_ix;
  }
}

class CurrencyItem {
  /**
   * Constructor for a CurrencyItem object.
   * 
   * @param {string} type - The type of currency.
   * @param {number} amount - The amount of currency.
   */
  constructor(type, amount) {
    this.type = type;
    this.amount = amount;
  }
}

class RoomPermissions {
  /**
   * Represents the room permissions for a given user.
   * Both moderator and designer can be null, meaning the bot
   * is not a moderator/designer, or can be a boolean value.
   */
  constructor() {
    this.moderator = null;
    this.designer = null;
  }
}

class Item {
  /**
   * Constructor for an Item object.
   * 
   * @param {string} type - The type of item.
   * @param {number} amount - The amount of the item.
   * @param {string} id - The ID of the item.
   */
  constructor(type, amount, id) {
    this.type = type;
    this.amount = amount;
    this.id = id;
  }
}

class Message {
  /**
   * A Highrise conversation message.
   * @param {string} message_id - The ID of the message.
   * @param {string} conversation_id - The ID of the conversation.
   * @param {Date|null} createdAt - The creation date of the message.
   * @param {string} content - The content of the message.
   * @param {string} sender_id - The ID of the sender.
   * @param {("text"|"invite")} category - The category of the message.
   */
  constructor(message_id, conversation_id, createdAt, content, sender_id, category) {
    this.message_id = message_id;
    this.conversation_id = conversation_id;
    this.createdAt = createdAt;
    this.content = content;
    this.sender_id = sender_id;
    this.category = category;
  }
}

class Conversation {
  /**
   * A Highrise conversation. Bots can join direct conversations, but not group conversations.
   * Bots can respond to messages in conversations, but cannot initiate messages.
   * @param {string} id - The ID of the conversation.
   * @param {boolean} did_join - Indicates whether the bot has joined the conversation.
   * @param {number} unread_count - The number of unread messages in the conversation.
   * @param {Message|null} last_message - The last message in the conversation.
   * @param {boolean} muted - Indicates whether the conversation is muted.
   * @param {Array<string>|null} member_ids - The IDs of the conversation members.
   * @param {string|null} name - The name of the conversation.
   * @param {string|null} owner_id - The ID of the conversation owner.
   */
  constructor(id, did_join, unread_count, last_message, muted, member_ids, name, owner_id) {
    this.id = id;
    this.did_join = did_join;
    this.unread_count = unread_count;
    this.last_message = last_message;
    this.muted = muted;
    this.member_ids = member_ids;
    this.name = name;
    this.owner_id = owner_id;
  }
}

class ChatRequest {
  /**
   * ChatRequest class representing a request to send a chat message.
   * @param {string} message - The message to send.
   * @param {string} whisperTargetId - The ID of the user to whisper to. Defaults to null.
   * @param {string} rid - The request ID. Defaults to null.
   */
  constructor(message, whisperTargetId = null, rid = null) {
    this.message = message;
    this.whisper_target_id = whisperTargetId;
    this.rid = rid;
  }

  /**
   * Get the response class for this request.
   * @returns {ChatResponse} The response class.
   */
  static get ChatResponse() {
    return ChatResponse;
  }

  /**
   * Get the response class for this request.
   * @returns {ChatResponse} The response class.
   */
  static get Response() {
    return ChatResponse;
  }
}

class GetConversationsRequest {
  /**
   * Get the conversations of a bat. if not_joined is true, only get the conversations that bot has not joined yet will
   * be returned. 20 conversations will be returned at most, if all 20 conversations are returned, the last_id can be used
   * to retrieve the next 20 conversations.
   */
  constructor(not_joined = false, last_id = null, rid = null) {
    this.not_joined = not_joined;
    this.last_id = last_id;
    this.rid = rid;
  }

  /**
   * @typedef {Object} GetConversationsResponse
   * @property {Array<Conversation>} conversations - List of conversations.
   * @property {number} not_joined - Number of conversations that the bot has not joined.
   * @property {string|null} rid - Optional parameter representing the ID of the request.
   */

  /**
   * Get the conversations response.
   * @type {GetConversationsResponse}
   */
  static get GetConversationsResponse() {
    class GetConversationsResponse {
      /**
       * @param {Array<Conversation>} conversations - List of conversations.
       * @param {number} not_joined - Number of conversations that the bot has not joined.
       * @param {string|null} rid - Optional parameter representing the ID of the request.
       */
      constructor(conversations, not_joined, rid) {
        this.conversations = conversations;
        this.not_joined = not_joined;
        this.rid = rid;
      }
    }
    return GetConversationsResponse;
  }
}
GetConversationsRequest.Response = GetConversationsRequest.GetConversationsResponse;



class GetMessagesRequest {
  /**
   * Get the messages of a conversation.
   * 20 messages will be returned at most, if all 20 messages are returned,
   * the last_message_id can be used to retrieve the next 20 messages.
   * @param {string} conversation_id - The ID of the conversation.
   * @param {string|null} last_message_id - The ID of the last retrieved message (optional).
   * @param {string|null} rid - The ID of the request (optional).
   */
  constructor(conversation_id, last_message_id = null, rid = null) {
    this.conversation_id = conversation_id;
    this.last_message_id = last_message_id;
    this.rid = rid;
  }

  /**
   * @typedef {object} GetMessagesResponse
   * @property {Array<Message>} messages - The list of messages.
   * @property {string|null} rid - The ID of the request.
   */
}

class GetMessagesResponse {
  /**
   * Constructor for a GetMessagesResponse object.
   * @param {Array<Message>} messages - The list of messages.
   * @param {string|null} rid - The ID of the request.
   */
  constructor(messages, rid = null) {
    this.messages = messages;
    this.rid = rid;
  }
}
GetMessagesRequest.Response = GetMessagesResponse;


class LeaveConversationRequest {
  /**
   * Leave a conversation.
   * @param {string} conversation_id - The ID of the conversation.
   * @param {string|null} rid - The ID of the request (optional).
   */
  constructor(conversation_id, rid = null) {
    this.conversation_id = conversation_id;
    this.rid = rid;
  }

  /**
   * @typedef {object} LeaveConversationResponse
   * @property {string|null} rid - The ID of the request.
   */
}

class LeaveConversationResponse {
  /**
   * Constructor for a LeaveConversationResponse object.
   * @param {string|null} rid - The ID of the request.
   */
  constructor(rid = null) {
    this.rid = rid;
  }
}
LeaveConversationRequest.Response = LeaveConversationResponse;


class GetWalletRequest {
  /**
   * Creates a new instance of GetWalletRequest.
   * @param {string|null} rid - The request ID.
   */
  constructor(rid = null) {
    this.rid = rid;
  }

  static get Response() {
    /**
     * The successful response to a GetWalletRequest.
     */
    class GetWalletResponse {
      /**
       * Creates a new instance of GetWalletResponse.
       * @param {Object} content - The content of the response.
       * @param {string} rid - The request ID.
       */
      constructor(content, rid) {
        this.content = content;
        this.rid = rid;
      }
    }
    return GetWalletResponse;
  }
}

class BuyVoiceTimeRequest {
  /**
   * Buy a voice time for a room.
   * @param {("bot_wallet_only"|"bot_wallet_priority"|"user_wallet_only")} paymentMethod - The payment method.
   * @param {string|null} rid - The room ID (optional).
   */
  constructor(paymentMethod, rid = null) {
    this.payment_method = paymentMethod;
    this.rid = rid;
  }

  static Response = class BuyVoiceTimeResponse {
    /**
     * Buy a voice token response.
     * @param {("success"|"insufficient_funds"|"only_token_bought")} result - The result of the purchase.
     * @param {string|null} rid - The room ID (optional).
     */
    constructor(result, rid = null) {
      this.result = result;
      this.rid = rid;
    }
  };
}
BuyVoiceTimeRequest.Response = BuyVoiceTimeRequest.Response;

class BuyItemRequest {
  /**
   * BuyItemRequest class constructor.
   * @param {string} item_id - The ID of the item being bought.
   * @param {string|null} rid - The request ID.
   */
  constructor(item_id, rid = null) {
    this.item_id = item_id;
    this.rid = rid;
  }

  /**
   * BuyItemResponse nested class.
   * @param {("success"|"insufficient_funds")} result - The result of the purchase.
   * @param {string|null} rid - The response ID.
   */
  static Response = class BuyItemResponse {
    constructor(result, rid = null) {
      this.result = result;
      this.rid = rid;
    }
  };
}

BuyItemRequest.Response = BuyItemRequest.Response;

class SetOutfitRequest {
  /**
   * Creates a new instance of SetOutfitRequest.
   * @param {Array<Item>} outfit - The outfit items.
   * @param {string|null} rid - The request ID.
   */
  constructor(outfit, rid = null) {
    this.outfit = outfit;
    this.rid = rid;
  }

  static get SetOutfitResponse() {
    /**
     * The successful response to a SetOutfitRequest.
     */
    return class {
      /**
       * Creates a new instance of SetOutfitResponse.
       * @param {string|null} rid - The request ID.
       */
      constructor(rid = null) {
        this.rid = rid;
      }
    };
  }

  static get Response() {
    return SetOutfitRequest.SetOutfitResponse;
  }
}



class BuyRoomBoostRequest {
  /**
   * Buy a room boost.
   * @param {("bot_wallet_only"|"bot_wallet_priority"|"user_wallet_only")} paymentMethod - The payment method.
   * @param {number} amount - The amount of boosts to buy.
   * @param {string|null} rid - The room ID (optional).
   */
  constructor(paymentMethod, amount = 1, rid = null) {
    this.payment_method = paymentMethod;
    this.amount = amount;
    this.rid = rid;
  }

  static Response = class BuyRoomBoostResponse {
    /**
     * Buy a room boost response.
     * @param {("success"|"insufficient_funds"|"only_token_bought")} result - The result of the purchase.
     * @param {string|null} rid - The room ID (optional).
     */
    constructor(result, rid = null) {
      this.result = result;
      this.rid = rid;
    }
  };
}
BuyRoomBoostRequest.Response = BuyRoomBoostRequest.Response;

class CheckVoiceChatRequest {
  /**
   * Check the voice chat status in the room.
   *
   * @param {string|null} rid The ID of the room to check the voice chat status in (optional).
   */
  constructor(rid = null) {
    this.rid = rid;
  }

  static get Response() {
    class CheckVoiceChatResponse {
      /**
       * Returns the status of voice chat in the room.
       *
       * @param {number} seconds_left The number of seconds left until the voice chat ends.
       * @param {Set<string>} auto_speakers The list of users that automatically have voice chat privileges in the room like moderators and owner.
       * @param {Object<string, 'invited' | 'voice' | 'muted'>} users The list of users that currently have voice chat privileges in the room.
       * @param {string|null} rid The ID of the room where the voice chat status was checked (optional).
       */
      constructor(seconds_left, auto_speakers, users, rid = null) {
        this.seconds_left = seconds_left;
        this.auto_speakers = auto_speakers;
        this.users = users;
        this.rid = rid;
      }
    }

    return CheckVoiceChatResponse;
  }
}

class FloorHitRequest {
  /**
   * Request to teleport to the specified floor within the room.
   * @param {string} destination The name or ID of the destination floor
   * @param {string|null} rid The ID of the room to teleport within
   */
  constructor(destination, rid = null) {
    this.destination = destination;
    this.rid = rid;
  }

  static get FloorHitResponse() {
    class FloorHitResponse {
      /**
       * The successful response to a `FloorHitRequest`.
       * @param {string|null} rid The ID of the room where the floor was hit
       */
      constructor(rid = null) {
        this.rid = rid;
      }
    }
    return FloorHitResponse;
  }

  static get Response() {
    return FloorHitRequest.FloorHitResponse;
  }
}

class AnchorHitRequest {
  /**
   * Request to teleport to the specified anchor within the room.
   * @param {string} destination The name or ID of the destination anchor
   * @param {string|null} rid The ID of the room to teleport within
   */
  constructor(anchor, rid = null) {
    this.anchor = anchor;
    this.rid = rid;
  }

  static get AnchorHitResponse() {
    class AnchorHitResponse {
      /**
       * The successful response to a `AnchorHitRequest`.
       * @param {string|null} rid The ID of the room where the floor was hit
       */
      constructor(rid = null) {
        this.rid = rid;
      }
    }
    return AnchorHitResponse;
  }

  static get Response() {
    return AnchorHitRequest.AnchorHitResponse;
  }
}

class InviteSpeakerRequest {
  /**
   * Invite a user to speak in the room.
   *
   * @param {string} user_id The ID of the user to invite.
   * @param {string|null} rid The ID of the room to invite the user to (optional).
   */
  constructor(user_id, rid = null) {
    this.user_id = user_id;
    this.rid = rid;
  }

  static get Response() {
    class InviteSpeakerResponse {
      /**
       * The response to an `InviteSpeakerRequest`.
       *
       * @param {string|null} rid The ID of the room where the user was invited to (optional).
       */
      constructor(rid = null) {
        this.rid = rid;
      }
    }

    return InviteSpeakerResponse;
  }
}

/**
* Represents a request to moderate a room for a given user.
*/
class ModerateRoomRequest {
  /**
   * Creates a new instance of the `ModerateRoomRequest` class.
   *
   * @param {string} user_id - The ID of the user to moderate the room for.
   * @param {string} moderation_action - The type of moderation action to perform (e.g. 'mute', 'kick', etc.).
   * @param {number|null} action_length - The length of the moderation action (in seconds) if applicable.
   * @param {string|null} rid - The ID of the room to moderate (optional).
   */
  constructor(user_id, moderation_action, action_length = null, rid = null) {
    this.user_id = user_id;
    this.moderation_action = moderation_action;
    this.action_length = action_length;
    this.rid = rid;
  }

  /**
   * Represents the response to a `ModerateRoomRequest`.
   */
  static get Response() {
    /**
     * Represents the successful response to a `ModerateRoomRequest`.
     */
    class ModerateRoomResponse {
      /**
       * Creates a new instance of the `ModerateRoomResponse` class.
       *
       * @param {string|null} rid - The ID of the room that was moderated (optional).
       */
      constructor(rid = null) {
        this.rid = rid;
      }
    }

    return ModerateRoomResponse;
  }
}

class RemoveSpeakerRequest {
  /**
   * Remove a user from speaking in the room.
   *
   * @param {string} user_id The ID of the user to remove from speaking.
   * @param {string|null} rid The ID of the room to remove the user from (optional).
   */
  constructor(user_id, rid = null) {
    this.user_id = user_id;
    this.rid = rid;
  }

  static get Response() {
    class RemoveSpeakerResponse {
      /**
       * The response to a `RemoveSpeakerRequest`.
       *
       * @param {string|null} rid The ID of the room from which the user was removed (optional).
       */
      constructor(rid = null) {
        this.rid = rid;
      }
    }

    return RemoveSpeakerResponse;
  }
}


class EmoteRequest {
  /**
   * Creates a new instance of EmoteRequest.
   * @param {string|null} targetUserId - The ID of the user to target with the emote.
   * @param {string} emoteId - The ID of the emote to use.
   * @param {string|null} rid - The request ID.
   */
  constructor(targetUserId = null, emoteId, rid = null) {
    this.emote_id = emoteId;
    this.target_user_id = targetUserId;
    this.rid = rid;
  }

  static get EmoteResponse() {
    /**
     * The successful response to an EmoteRequest.
     */
    return class {
      /**
       * Creates a new instance of EmoteResponse.
       * @param {string|null} rid - The request ID.
       */
      constructor(rid = null) {
        this.rid = rid;
      }
    };
  }

  static get Response() {
    return EmoteRequest.EmoteResponse;
  }
}

class ReactionRequest {
  /**
   * Creates a new instance of ReactionRequest.
   * @param {string|null} targetUserId - The ID of the user to target with the reaction.
   * @param {string} reactionId - The ID of the reaction to use.
   * @param {string|null} rid - The request ID.
   */
  constructor(targetUserId = null, reactionId, rid = null) {
    this.reaction = reactionId;
    this.target_user_id = targetUserId;
    this.rid = rid;
  }

  static get ReactionResponse() {
    /**
     * The successful response to an ReactionResponse.
     */
    return class {
      /**
       * Creates a new instance of ReactionResponse.
       * @param {string|null} rid - The request ID.
       */
      constructor(rid = null) {
        this.rid = rid;
      }
    };
  }

  static get Response() {
    return ReactionRequest.ReactionResponse;
  }
}

class MoveUserToRoomRequest {
  /**
   * Move user to another room using room_id as a target room id.
   * Bot operator must be owner of the target room, or has designer privileges in the target room, this will also work
   * if bot has designer privileges in the target room.
   *
   * All other restriction to room movement apply, ie if target room is full this will fail.
   *
   * @param {string} userId - The ID of the user to be moved to a different room.
   * @param {string} roomId - The ID of the room to which the user will be moved.
   * @param {string|null} rid - Optional parameter that indicates the request ID.
   */
  constructor(userId, roomId, rid = null) {
    this.user_id = userId;
    this.room_id = roomId;
    this.rid = rid;
  }

  /**
   * Move user to another room response.
   *
   * @class MoveUserToRoomResponse
   */
  static get MoveUserToRoomResponse() {
    return MoveUserToRoomResponse;
  }

  /**
   * Move user to another room response.
   *
   * @class MoveUserToRoomResponse
   */
  static get Response() {
    return MoveUserToRoomResponse;
  }
}

class MoveUserToRoomResponse {
  /**
   * Move user to another room response.
   *
   * @param {string|null} rid - Optional parameter that indicates the request ID.
   */
  constructor(rid = null) {
    this.rid = rid;
  }
}
MoveUserToRoomResponse.Response = MoveUserToRoomResponse;
MoveUserToRoomRequest.Response = MoveUserToRoomResponse;

/**
* The request to teleport a user to a new destination.
*/
class TeleportRequest {
  /**
   * @param {string} userId - The ID of the user to teleport.
   * @param {string} destination - The destination to teleport the user to.
   * @param {string|null} rid - An optional request ID.
   */
  constructor(userId, destination, rid = null) {
    this.user_id = userId;
    this.destination = destination;
    this.rid = rid;
  }

  /**
   * The response to a teleport request.
   */
  static get TeleportResponse() {
    return TeleportResponse;
  }

  /**
   * The response class for this request.
   */
  static get Response() {
    return TeleportResponse;
  }
}
class TeleportResponse {
  /**
   * The successful response to a `TeleportRequest`.
   * @param {string|null} rid The ID of the room the bot was teleported to
   */
  constructor(rid = null) {
    this.rid = rid;
  }
}
TeleportRequest.Response = TeleportResponse;

class GetUserOutfitRequest {
  /**
   * Get the outfit of a user.
   * @param {string} user_id - The ID of the user.
   * @param {string|null} rid - Optional parameter representing the ID of the request.
  */
  constructor(user_id, rid = null) {
    this.user_id = user_id;
    this.rid = rid
  }

  /**
   * The outfit of a user. Returns list of items user is currently wearing.
  */

  static get GetUserOutfitResponse() {
    class GetUserOutfitResponse {
      /**
       * @param {Array<Item>} outfit - List of items the user is currently wearing.
       * @param {string|null} rid - Optional parameter representing the ID of the request.
       */
      constructor(outfit, rid) {
        this.outfit = outfit;
        this.rid = rid;
      }
    }
    return GetUserOutfitResponse;
  }
}
GetUserOutfitRequest.Response = GetUserOutfitRequest.GetUserOutfitResponse;

class GetInventoryRequest {
  /**
   * GetInventoryRequest class constructor.
   * @param {string|null} rid - The request ID.
   */
  constructor(rid = null) {
    this.rid = rid;
  }

  /**
   * GetInventoryResponse nested class.
   * @param {Array<Item>} items - The list of items.
   * @param {string|null} rid - The response ID.
   */
  static get GetInventoryResponse() {
    class GetInventoryResponse {
      constructor(items, rid) {
        this.items = items;
        this.rid = rid;
      }
    }

    return GetInventoryResponse;
  }
}

GetInventoryRequest.Response = GetInventoryRequest.GetInventoryResponse;


class GetRoomPrivilegeRequest {
  /**
   * Construct a GetRoomPrivilegeRequest.
   * 
   * @param {string} user_id - The ID of the user to get room privilege for.
   */
  constructor(user_id, rid = null) {
    this.user_id = user_id;
    this.rid = rid
  }

  static get GetRoomPrivilegeResponse() {
    class GetRoomPrivilegeResponse {
      /**
       * Construct a GetRoomPrivilegeResponse.
       * 
       * @param {Object} content - The content of the response.
       * @param {string} rid - The ID of the room for which the privilege was requested.
       */
      constructor(content, rid) {
        this.content = content;
        this.rid = rid;
      }
    }
    return GetRoomPrivilegeResponse;
  }
}
GetRoomPrivilegeRequest.Response = GetRoomPrivilegeRequest.GetRoomPrivilegeResponse;


class GetBackpackRequest {
  /**
   * Fetch a user's world backpack.
   * @param {string} user_id - The ID of the user.
   * @param {string|null} rid - Optional parameter representing the ID of the request.
  */
  constructor(user_id, rid = null) {
    this.user_id = user_id;
    this.rid = rid;
  }

  /**
   * The user's world backpack.
  */

  static get GetBackpackResponse() {
    class GetBackpackResponse {
      /**
       * @param {Object<string, number>} backpack - The user's world backpack represented as a counter of items.
       * @param {string|null} rid - Optional parameter representing the ID of the request.
       */
      constructor(backpack, rid) {
        this.backpack = backpack;
        this.rid = rid;
      }
    }
    return GetBackpackResponse;
  }
}
GetBackpackRequest.Response = GetBackpackRequest.GetBackpackResponse;


class ChangeBackpackRequest {
  /**
   * @param {string} user_id - The ID of the user.
   * @param {Object<string, number>} changes - The changes to be made to the user's backpack represented as a counter of items.
   * @param {string|null} rid - Optional parameter representing the ID of the request.
   */
  constructor(user_id, changes, rid = null) {
    this.user_id = user_id;
    this.changes = changes;
    this.rid = rid;
  }

  /**
   * The response of the ChangeBackpackRequest.
   */
  static get ChangeBackpackResponse() {
    class ChangeBackpackResponse {
      /**
       * @param {string|null} rid - Optional parameter representing the ID of the request.
       */
      constructor(rid = null) {
        this.rid = rid;
      }
    }
    return ChangeBackpackResponse;
  }
}
ChangeBackpackRequest.Response = ChangeBackpackRequest.ChangeBackpackResponse;

class TipUserRequest {
  /**
   * The request to tip a user.
   * @param {string} user_id - The ID of the user to tip.
   * @param {string} gold_bar - The type of gold bar to use for the tip.
   * @param {string|null} rid - An optional request ID.
   */
  constructor(user_id, gold_bar, rid = null) {
    this.user_id = user_id;
    this.gold_bar = gold_bar;
    this.rid = rid;
  }

  /**
   * The response to a tip user request.
   */
  static get TipUserResponse() {
    return TipUserResponse;
  }
}

class TipUserResponse {
  /**
   * The successful response to a `TipUserRequest`.
   * @param {string} result - The result of the tip operation ("success" or "insufficient_funds").
   * @param {string|null} rid - The request ID.
   */
  constructor(result, rid = null) {
    this.result = result;
    this.rid = rid;
  }
}

TipUserRequest.Response = TipUserResponse;

class GetRoomUsersRequest {
  /**
   * @param {string} rid - The room ID to get users from.
   */
  constructor(rid) {
    this.rid = rid;
  }

  static get Response() {
    class GetRoomUsersResponse {
      /**
       * @param {Array} content - The users in the room.
       * @param {string} rid - The request ID.
       */
      constructor(content, rid) {
        this.content = content;
        this.rid = rid;
      }
    }
    return GetRoomUsersResponse;
  }
}

class SendPayloadWithoutResponse {
  constructor(bot) {
    this.bot = bot;
  }

  sendPayloadWithoutResponse(payload) {
    if (!this.bot.isWebSocketOpen() && this.bot.ws === null) {
      return Promise.reject(new HighrisejsError(ErrorCodes.WebSocketNotOpen));
    }

    return new Promise((resolve, reject) => {
      const errorHandler = (event) => {
        if (event.data) {
          const errorData = JSON.parse(event.data);
          if (errorData._type === 'Error') {
            this.bot.ws.removeEventListener('message', errorHandler);
            reject(new Error(errorData.data?.message || errorData.message));
          } else {
            this.bot.ws.removeEventListener('message', errorHandler);
            resolve();
          }
        }
      }

      this.bot.ws.addEventListener('message', errorHandler);
      this.bot.ws.send(JSON.stringify(payload), (error) => {
        if (error) {
          this.bot.ws.removeEventListener('message', errorHandler);
          reject(error);
        }
      });
    });
  }
}

class SendPayloadAndGetResponse {
  constructor(bot) {
    this.bot = bot;
  }

  sendPayloadAndGetResponse(payload, responseClass) {
    if (!this.bot.isWebSocketOpen() && this.bot.ws === null) {
      return Promise.reject(new HighrisejsError(ErrorCodes.WebSocketNotOpen));
    }

    return new Promise((resolve, reject) => {
      const requestId = generateRid();

      const errorHandler = (event) => {
        const errorData = JSON.parse(event.data);
        if (errorData._type === 'Error') {
          this.bot.ws.removeEventListener('message', errorHandler);
          this.bot.ws.removeEventListener('message', messageHandler);
          reject(new Error(errorData.message));
        }
      };

      const messageHandler = (message) => {
        try {
          const messageObject = JSON.parse(message.data);

          if (messageObject._type === responseClass.name && messageObject.rid === requestId) {
            this.bot.ws.removeEventListener('message', errorHandler);
            this.bot.ws.removeEventListener('message', messageHandler);
            resolve(new responseClass(messageObject, requestId));
          }
        } catch (error) {
          this.bot.ws.removeEventListener('message', errorHandler);
          this.bot.ws.removeEventListener('message', messageHandler);
          reject(new Error("Received message is not valid JSON"));
        }
      };

      this.bot.ws.addEventListener('message', errorHandler);
      this.bot.ws.addEventListener('message', messageHandler);
      this.bot.ws.send(JSON.stringify({ ...payload, rid: requestId }), (error) => {
        if (error) {
          this.bot.ws.removeEventListener('message', errorHandler);
          this.bot.ws.removeEventListener('message', messageHandler);
          reject(error);
        }
      });
    });
  }
}

module.exports = {
  SessionMetadata,
  User,
  Position,
  AnchorPosition,
  CurrencyItem,
  RoomPermissions,
  Item,
  Conversation,
  ChatRequest,
  GetConversationsRequest,
  GetMessagesRequest,
  LeaveConversationRequest,
  SendPayloadAndGetResponse,
  SendPayloadWithoutResponse,
  GetWalletRequest,
  BuyVoiceTimeRequest,
  BuyRoomBoostRequest,
  CheckVoiceChatRequest,
  FloorHitRequest,
  AnchorHitRequest,
  InviteSpeakerRequest,
  RemoveSpeakerRequest,
  ModerateRoomRequest,
  EmoteRequest,
  ReactionRequest,
  MoveUserToRoomRequest,
  TeleportRequest,
  GetUserOutfitRequest,
  GetRoomPrivilegeRequest,
  GetBackpackRequest,
  GetRoomUsersRequest,
  RoomInfo,
  TipUserRequest,
  GetInventoryRequest,
  BuyItemRequest,
  SetOutfitRequest
}