'use strict';

module.exports.Room = require("./RoomRequest");
module.exports.Users = require("./UserRequest");
module.exports.Move = require("./MoveRequest");
module.exports.Cache = require("./Cache");
module.exports.DirectMessages = require("./DirectMessagesRequest");
module.exports.VoiceChat = require("./VoiceRequest");
module.exports.Outfit = require("./BotRequest").Outfit;
module.exports.Item = require("./BotRequest").Item;
module.exports.Inventory = require("./BotRequest").Inventory;
module.exports.Wallet = require("./BotRequest").Wallet;
module.exports.AwaitRequests = require("./AwaitRequest");
module.exports.Message = require("./MessageRequest").PublicMessage;
module.exports.Whisper = require("./MessageRequest").WhisperMessage;
module.exports.Invite = require("./MessageRequest").Invite;
module.exports.DirectMessage = require("./MessageRequest").DirectMessage;