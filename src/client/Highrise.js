const { HighriseTypeError, ErrorCodes } = require("../errors");
const WebSocketManager = require("./WebSocketManager");

const Actions = require("./actions");

class Highrise extends WebSocketManager {

  /**
   * @param {Object} [options={}] Options for the client
   * @param {string[]} [options.Events=[]] Events to listen to default is ready
   * @param {boolean} [options.Cache] Whether to enable caching default is false
   */
  constructor(options = { Events: [], Cache: false, AutoFetchMessages: false }) {
    super(options);

    this.Events = options.Events || [];
    this.Cache = options.Cache || false;
    this.AutoFetchMessages = options.AutoFetchMessages || false;

    this.auth = {
      token: null,
      room: { id: null, name: null }
    }

    this.info = {
      user: { id: null },
      owner: { id: null },
      connection_id: null,
    }

    // Post Methods
    this.room = {
      players: new Actions.Room(this),
      cache: new Actions.Cache(this),
      voice: new Actions.VoiceChat(this)
    }

    this.player = new Actions.Users(this);
    this.move = new Actions.Move(this);
    this.inbox = new Actions.DirectMessages(this);
    this.outfit = new Actions.Outfit(this);
    this.wallet = new Actions.Wallet(this);
    this.inventory = new Actions.Inventory(this);
    this.items = new Actions.Item(this);
    this.chat = new Actions.AwaitRequests(this);
    this.direct = new Actions.DirectMessage(this);
    this.invite = new Actions.Invite(this);
    this.message = new Actions.Message(this);
    this.whisper = new Actions.Whisper(this);

    this._validateOptions({ Events: this.Events, Cache: this.Cache, AutoFetchMessages: this.AutoFetchMessages });
  }

  process(event, ...args) {
    process.on(event, ...args);
  }

  async login(token = this.token, room = this.room) {
    if (!token) throw new HighriseTypeError(ErrorCodes.TokenInvalid);
    if (!room) throw new HighriseTypeError(ErrorCodes.RoomInvalid);

    if (token.length !== 64) throw new HighriseTypeError(ErrorCodes.TokenInvalid);
    if (room.length !== 24) throw new HighriseTypeError(ErrorCodes.RoomInvalid);

    this.auth.token = token;
    this.auth.room.id = room;

    await this.connect();
  }

  /**
   * Validates the options passed to the Client
   * @param {ClientOptions} [options=this.options] Options to validate
   * @private
   */
  _validateOptions(options) {
    if (!Array.isArray(options.Events)) {
      throw new HighriseTypeError(ErrorCodes.ClientInvalidOption, 'event', 'Array');
    }

    if (options.Events.length === 0) {
      throw new HighriseTypeError(ErrorCodes.ClientMissingEvents);
    }

    if (options.Cache && typeof options.Cache !== 'boolean') {
      throw new HighriseTypeError(ErrorCodes.ClientInvalidOption, 'cache', 'boolean');
    }

    if (options.AutoFetchMessages && typeof options.AutoFetchMessages !== 'boolean') {
      throw new HighriseTypeError(ErrorCodes.ClientInvalidOption, 'AutoFetchMessages', 'boolean');
    }
  }
}

module.exports = Highrise;