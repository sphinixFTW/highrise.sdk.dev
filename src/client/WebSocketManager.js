const EventEmitter = require('node:events');
const WebSocket = require('ws');
const { HighrisejsError, ErrorCodes } = require('../errors');
const { WebSocketEventParameters, WebSocketEventType } = require('../utils/Events');
const { generateRid, packageAuthor, packageVersion, getUptime } = require('../utils/Util');
const { handleEvent } = require('../handlers/events');

class WebSocketManager extends EventEmitter {
  constructor(client) {
    super();

    this.connected = false;
    this._reconnecting = false;
    this._reconnectDuration = 5;

    this._reconnectTimeout = null;
    this._keepAliveInterval = null;

    this._onOpen = this._onOpen.bind(this);
    this._onMessage = this._onMessage.bind(this);
    this._onClose = this._onClose.bind(this);
    this._onError = this._onError.bind(this);
    this._onEvent = this._onEvent.bind(this);

    Object.defineProperty(this, 'client', { value: client });
  }

  /**
   * Connects to the Highrise WebSocket gateway
   * @param {string} token The token to use for the connection
   * @param {string} room The room to connect to
   * @returns {Promise<void>}
   */
  connect() {
    const invalidToken = new HighrisejsError(ErrorCodes.TokenInvalid);
    const invalidRoom = new HighrisejsError(ErrorCodes.RoomInvalid);

    const events = this.client.Events.map(e => WebSocketEventParameters[e]).filter(Boolean).join(',');
    if (!events.length) throw new HighrisejsError(ErrorCodes.ClientMissingEvents);

    if (!this.auth.token) throw invalidToken;
    if (!this.auth.room.id) throw invalidRoom;

    if (this.auth.token.length !== 64) throw invalidToken;
    if (this.auth.room.id.length !== 24) throw invalidRoom;

    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        throw new HighrisejsError(ErrorCodes.WebSocketAlreadyConnected);
      }

      const endpoint = `wss://highrise.game/web/botapi?events=${events}`;
      this.ws = new WebSocket(endpoint, {
        headers: {
          'room-id': this.auth.room.id,
          'api-token': this.auth.token,
        }
      });

      this.ws.setMaxListeners(100);
      this.connected = true;
      this.ws.addEventListener('open', this._onOpen);
      this.ws.addEventListener('message', this._onMessage);
      this.ws.addEventListener('close', this._onClose);
      this.ws.addEventListener('error', this._onError);

    } catch (error) {
      this.connected = false;
      this._reconnecting = false;
      return console.error("[i]".red + " Error when creating WebSocket: " + e + ". Please report this to @iHsein in the Highrise Discord server.")
    }

  }

  uptime() {
    const uptime = getUptime();
    return uptime;
  }

  async reconnect() {
    if (this._reconnecting) {
      return console.log('[i]'.blue + ' Bot is already reconnecting. Skipping reconnect.');
    }

    this._reconnecting = true;
    console.log('[i]'.yellow + ' Attempting to reconnect in' + ` ${this._reconnectDuration}`.yellow + ' seconds...');

    clearTimeout(this._reconnectTimeout);
    this._reconnectTimeout = setTimeout(async () => {
      this._reconnecting = false;
      this.info.connection_id = null;
      this.clearListeners();

      await this.connect();
      this._reconnectDuration = 5;
    }, this._reconnectDuration * 1000);
  }

  /**
   * Send a keepalive request. This must be sent every 15 seconds or the server will terminate the connection.
   * @returns {Promise<void>}
   * @private
   */
  async _sendKeepAlive() {
    if (!this.connected) return;
    if (this.ws && this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(JSON.stringify({ _type: 'KeepaliveRequest', rid: generateRid() }));

    clearTimeout(this._keepAliveInterval);
    this._keepAliveInterval = setTimeout(() => {
      this._sendKeepAlive();
    }, 15 * 1000);
  }

  /**
   * Destroys the WebSocket connection
   * @returns {Promise<void>}
   * @private
   */
  async destory() {
    if (!this.connected) return console.log('[i]'.blue + ' WebSocket is already destroyed.');

    this.connected = false;
    this._reconnecting = false;
    this._keepAliveInterval = null;
    this._reconnectTimeout = null;
    this.ws.close();
    this.clearListeners();
    this.resetInfo();
    this.ws = null;
  }

  async shutdown() {
    this.destory();
  }

  /**
   * Resets the client's info
   * @returns {Promise<void>}
   * @private
   */
  async resetInfo() {
    this.auth.token = null;
    this.auth.room.id = null;
    this.auth.room.name = null;

    this.info.user.id = null;
    this.info.owner.id = null;
    this.info.connection_id = null;
  }

  /**
   * Handle incoming messages from the WebSocket
   * @param {*} data 
   * @returns 
  */
  async _onEvent(data) {
    const evenType = data._type;
    const events = WebSocketEventType[evenType];
    if (!events) return;

    handleEvent.call(this, ...[evenType, data, this]);
  }

  async _onMessage(event) {
    if (!this.connected) return;
    const data = JSON.parse(event.data);
    if (!data) return;
    const eventType = data._type;
    if (!eventType) return;

    this._onEvent(data);

    if (eventType === 'SessionMetadata') {
      this.auth.room.name = data.room_info.room_name ?? null;
      this.info.user.id = data.user_id ?? null;
      this.info.owner.id = data.room_info.owner_id ?? null;
      this.info.connection_id = data.connection_id ?? null;
      if (this.Cache) {
        await this.room.cache.FetchUserCollection();
      }
    }

    if (this.Cache) {
      if (this.Events.includes(eventType)) {
        switch (eventType) {
          case 'UserJoinedEvent':
            const userData = {
              id: data.user.id,
              username: data.user.username,
              position: { x: data.position.x, y: data.position.y, z: data.position.z, facing: data.position.facing }
            }
            this.room.cache.addUserToCollection(data.user.id, userData);
            break;
          case 'UserLeftEvent':
            this.room.cache.removeUserFromCollection(data.user.id);
            break;
          case 'UserMovedEvent':
            this.room.cache.updateUserPosition(data.user.id, data.position);
            break;
        }
      }
    }

    //console.log("[i]".cyan + ` Received ${ data._type } event.`.green + `\nData: ${ JSON.stringify(data) }`);
  }

  /**
  * Handle open events
  * @returns {Promise<void>}
  * @private
  */
  _onOpen() {
    if (this.connected) {
      const today = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
      console.log("[i]".cyan + ` Connected using Highrise JavaScript SDK(v${packageVersion()}) by ${packageAuthor()} at ${today}`.green);
      this._sendKeepAlive();
    } else {
      console.log("[i]".red + " WebSocket connection closed.");
    }
  }

  /**
   * Handles on close events
   * @param {CloseEvent} event The close event
   * @returns {Promise<void>}
   * @private
   */
  _onClose(event) {
    if (this.connected) {
      this.close(event);
      this.connected = false;
      this._reconnecting = false;
      this.reconnect();
    } else {
      console.log("[i]".red + " WebSocket connection closed.");
    }
  }

  /**
   * Handles on error events
   * @param {ErrorEvent} event The error event
   * @returns {Promise<void>}
   * @private
  */
  _onError(event) {
    if (this.connected) {
      if (event.message && event.message === 'Unexpected server response: 429') {
        this._reconnectDuration = this._reconnectDuration + 5;
      }

      this.connected = false;
      this._reconnecting = false;
      this.reconnect();
    } else {
      console.error("[i]".red + " WebSocket error: " + event.message);
    }
  }

  close(event) {
    const today = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    switch (event.code) {
      case 1000:
        console.log(`[i]`.green + ` WebSocket connection closed at ${today}.`);
        break;
      case 1001:
        console.log(`[i]`.yellow + ` WebSocket connection closed at ${today}.`);
        break;
      case 1006:
        console.log(`[i]`.red + ` WebSocket connection closed at ${today}.`);
        break;
      default:
        console.log(`[i]`.yellow + ` WebSocket connection closed at ${today}.`);
        break;
    }
  }

  isWebSocketOpen() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  async clearListeners() {
    const events = ['open', 'message', 'close', 'error'];
    events.forEach(event => {
      this.ws.removeAllListeners(event);
    });
  }
}

module.exports = WebSocketManager;