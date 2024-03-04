// DOM types required for undici
/// <reference lib="dom" />

export interface User {
  id: string;
  username: string;
}

export interface RoomPermissions {
  moderator: boolean;
  designer: boolean;
}

export interface Item {
  type: string;
  amount: number;
  id: string;
}

export interface CurrencyItem {
  type: string;
  amount: number
}

export interface Message {
  message_id: string;
  conversation_id: string;
  createdAt: Date;
  content: string;
  sender_id: string;
  category: 'text' | 'invite';
}

export interface Converstation {
  id: string;
  did_join: boolean;
  unread_count: number;
  last_message: string;
  muted: boolean;
  member_ids: string[];
  name: string;
  owner_id: string;
}

export interface Sender {
  id: string;
  username: string;
}

export interface Receiver {
  id: string;
  username: string;
}

export interface Position {
  x: number;
  y: number;
  z: number;
  facing: string
}

export interface AnchorPosition {
  entity_id: string;
  anchor_ix: number;
}

export interface ConversationData {
  id: string;
  isNew: boolean;
}

export interface SessionMetaData {
  user_id: string;
  room_info: RoomInfo;
  rate_limits: RateLimits;
  connection_id: string;
  sdk_version: string;
}

export interface RoomInfo {
  owner_id: string;
  room_name: string;
}

export interface RateLimits {
  client: number;
  socials: number;
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export enum Rarity {
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
  None = 'none'
}

export enum Categories {
  Aura = 'aura',
  Bag = 'bag',
  Blush = 'blush',
  Body = 'body',
  Dress = 'dress',
  Earrings = 'earrings',
  Emote = 'emote',
  Eye = 'eye',
  Eyebrow = 'eyebrow',
  Face_hair = 'face_hair',
  Fishing_rod = 'fishing_rod',
  Freckle = 'freckle',
  Fullsuit = 'fullsuit',
  Glasses = 'glasses',
  Gloves = 'gloves',
  Hair_back = 'hair_back',
  Hair_front = 'hair_front',
  Handbag = 'handbag',
  Hat = 'hat',
  Jacket = 'jacket',
  Lashes = 'lashes',
  Mole = 'mole',
  Mouth = 'mouth',
  Neckless = 'neckless',
  Nose = 'nose',
  Pants = 'pants',
  Rod = 'rod',
  Shirt = 'shirt',
  Shoes = 'shoes',
  Skirt = 'skirt',
  Sock = 'sock',
  Tattoo = 'tattoo',
  Watch = 'watch',
}

export interface ClientEvents {
  ready: [session: SessionMetaData];
  chatCreate: [user: User, message: string];
  whisperCreate: [user: User, message: string];
  messageCreate: [user_id: string, conversation: ConversationData, message: string | undefined];
  voiceCreate: [users: object[], seconds_left: number];
  roomModerate: [moderator_id: string, target_id: string, action: string, duration: number | null];
  playerJoin: [user: User, position: Position];
  playerLeave: [user: User];
  playerEmote: [sender: Sender, receiver: Receiver, emote_id: string];
  playerReact: [sender: Sender, receiver: Receiver, reaction_id: string];
  playerTip: [sender: Sender, receiver: Receiver, item: CurrencyItem];
  playerMove: [user: User, position: Position | AnchorPosition];
  error: [error: string];
  channel: [sender_id: string, message: string, tags: Array<[]>];
}


export const Events = {
  /**
  * Represents chat messages sent in the Highrise room.
  */
  Messages: 'ChatEvent',
  /**
   * Represents direct messages sent to the bot.
  */
  DirectMessages: 'MessageEvent',
  /**
   * Indicates when users join the room.
  */
  Joins: 'UserJoinedEvent',
  /**
   *  Indicates when users leave the room.
  */
  Leaves: 'UserLeftEvent',
  /**
   * Represents reactions added to players.
  */
  Reactions: 'ReactionEvent',
  /**
   * Represents emotes added to players.
  */
  Emotes: 'EmoteEvent',
  /**
   * Represents tip reactions received.
  */
  Tips: 'TipReactionEvent',
  /**
   * Represents voice chat events.
  */
  VoiceChat: 'VoiceEvent',
  /**
   * Indicates when users move within the room.
  */
  Movements: 'UserMovedEvent',
  /**
   * Indicates when moderators perform moderation actions on players.
  */
  Moderate: 'RoomModeratedEvent',
  /**
   * On a hidden channel message.
  */
  Channel: 'ChannelEvent'
} as const;

export interface HighriseOptions {
  options: {
    Events: (keyof typeof Events)[];
    /**
     * Whether to cache the events or not.
     * Default is false.
     */
    Cache?: boolean;
    AutoFetchMessages?: boolean;
  }
}

/**
 * @internal
 */
interface CollectionConstructor {
  new(): Collection<unknown, unknown>;
  new <K, V>(entries?: readonly (readonly [K, V])[] | null): Collection<K, V>;
  new <K, V>(iterable: Iterable<readonly [K, V]>): Collection<K, V>;
  readonly prototype: Collection<unknown, unknown>;
  readonly [Symbol.species]: CollectionConstructor;
}

/**
 * Represents an immutable version of a collection
 */
type ReadOnlyCollection<K, V> = Omit<Collection<K, V>, 'delete' | 'ensure' | 'forEach' | 'get' | 'reverse' | 'set' | 'sort' | 'sweep' | 'update'> & ReadonlyMap<K, V>;

/**
 * A map with additional utility methods. Keys must be strings.
 * 
 * @typeParam K - The key type
 * @typeParam V - The value type
 */
declare class Collection<K, V> extends Map<K, V> {

  /**
   * Creates a new Collection.
   * @param entries - Entries to fill the collection with
   * @example
   * const collection = new Collection([['a', 'b'], ['c', 'd']]);
   * console.log(collection.size); // 2
  */
  set(key: K, value: V): this;

  /**
   * Get a value from the collection by key.
   * @param key - The key to get from the collection
   * @returns The value, if found
   * 
   * @example
   * const collection = new Collection([['a', 'b'], ['c', 'd']]);
   * console.log(collection.get('a')); // 'b'
   */
  get(key: K): V | undefined;

  /**
   * Deletes a key from the collection.
   * @param key - The key to delete from the collection
   * @returns Whether or not the key was deleted
   * 
   * @example
   * const collection = new Collection([['a', 'b'], ['c', 'd']]);
   * console.log(collection.delete('a')); // true
   */
  delete(key: K): boolean;


  /**
   * Get a random value from the collection.
   * 
   * @param condition - A function to use to filter the random value
   * @returns The random value, if found
   * 
   * @example
   * const collection = new Collection([['a', 'b'], ['c', 'd']]);
   * console.log(collection.random()); // 'b'
   */
  random(condition?: (value: V, key: K, collection: this) => boolean): V | undefined;
  /**
   * Deletes everything from the collection.
   * @example
   * const collection = new Collection([['a', 'b'], ['c', 'd']]);
   * collection.clear();
   */
  clear(): void;

  /**
   * Check if a key exists in the collection.
   * @param key - The key to check for
   * @returns Whether or not the key exists
   * 
   * @example
   * const collection = new Collection([['a', 'b'], ['c', 'd']]);
   * console.log(collection.has('a')); // true
   */
  has(key: K): boolean;

  /**
   * Filter the collection, returning a new collection with only the entries that pass the filter function.
   * @param fn - The filter function to use
   * @returns A new collection with the filtered entries
   * 
   * @example
   * const collection = new Collection([['a', 'b'], ['c', 'd']]);
   * console.log(collection.filter(entry => entry === 'b')); // Collection { 'a' => 'b' }
   */
  filter(fn: (value: V, key: K, collection: this) => boolean): this;

  /**
   * Map the collection, returning a new collection with the results of the map function.
   * @param fn - The map function to use
   * @returns A new collection with the mapped entries
   * 
   * @example
   * const collection = new Collection([['a', 'b'], ['c', 'd']]);
   * console.log(collection.map(entry => entry)); // Collection { 'a' => 'b', 'c' => 'd' }
   */
  map(fn: (value: V, key: K, collection: this) => unknown): unknown[];

  /**
   * Ensure that a key exists in the collection, otherwise throw an error.
   * @param key - The key to ensure
   * @param value - The value to use if the key does not exist
   * @returns The existing or newly created value
   * 
   * @example
   * const collection = new Collection([['a', 'b'], ['c', 'd']]);
   * console.log(collection.ensure('a', 'e')); // 'b'
   * console.log(collection.ensure('e', 'f')); // 'f'
   * console.log(collection.get('e')); // 'f'
   */
  ensure(key: K, value: V): V;

  /**
   * Sort the collection, returning a new collection sorted by the given function.
   * @param fn - The sort function to use
   * @returns A new collection sorted by the sort function
   * 
   * @example
   * const collection = new Collection([['a', 'b'], ['c', 'd']]);
   * console.log(collection.sort((a, b) => a.localeCompare(b))); // Collection { 'a' => 'b', 'c' => 'd' }
   */
  sort(fn: (a: V, b: V, keyA: K, keyB: K) => number): this;

  /**
   * Update a value in the collection.
   * @param key - The key to update
   * @param value - The new value
   * @returns The updated collection
   * 
   * @example
   * const collection = new Collection([['a', 'b'], ['c', 'd']]);
   * collection.update('a', 'e');
   * console.log(collection.get('a')); // 'e'
   */
  update(key: K, value: V): this;
}


export class WebSocketManager {
  on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
  once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
  on<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => void,
  ): this;
  once<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => void,
  ): this;
}

export class Highrise extends WebSocketManager {
  /**
 * The events that the Highrise SDK should listen for.
 * Note: Not including the event will cause the SDK to not listen for it.
 * This includes caches and other features that rely on the event.
 * As for caches we use the PlayerMove, PlayerJoin, PlayerLeave events to update the cache.
 * Enabling AutoFetchMessages will also enable the Messages and DirectMessages events.
 * @default ['Ready', 'Errors']
 * @example
 * const { Highrise, Events } = require("highrise.sdk.dev");
 * const client = new Highrise({
 *  Events: [Events.Messages, Events.DirectMessages],
 *  Cache: true,
 *  AutoFetchMessages: true
 * });
 * 
 */
  public constructor(options: { Events: (keyof typeof Events)[]; Cache?: boolean; AutoFetchMessages?: boolean; });

  /**
   * - Login to the Highrise room.
   * - Get your bot token from https://create.highrise.game/dashboard/credentials/api-keys
   * - Get your room ID from https://webapi.highrise.game/rooms?&owner_id=55bb64735531104341039ca8&limit=100
   * - Replace the owner_id with your user ID.
   * @param {string} token - The token to login with.
   * @param {string} room_id - The room ID to login to.
   * @returns {Promise<void>} - A promise that resolves when the client is ready.
   */
  public login(token: string, room_id: string): Promise<void>;

  /**
   * - Get the bot uptime.
   * - This is used internally by the SDK.
   * @returns {number} - The bot uptime.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * console.log(bot.uptime()); // The bot uptime.
  */
  public uptime(): number;

  /**
   * - Destroy the client.
   * - This is used internally by the SDK.
   * @returns {void}
  */
  public destroy(): void;

  /**
   * - Shutdowns the client.
   * - Closes the WebSocket connection.
   * - Clears the cache.
   * @returns {Promise<void>} - A promise that resolves when the client is shutdown.
  */
  public shutdown(): Promise<void>;

  /**
   * - Process an event.
   * - This is used internally by the SDK.
   * @param {string} event - The event to process.
   * @param {any[]} args - The arguments to process.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.process('unhandledRejection', (reason, promise) => {
   * console.log("[!]".red + " Unhandled Rejection at: ", promise, " reason: ", reason);
   * });
   */
  public process(event: string, ...args: any[]): void;

  /**
   * - Shutdowns the client.
   * - Closes the WebSocket connection.
   * - Clears the cache.
   * @returns {Promise<void>} - A promise that resolves when the client is shutdown.
  */
  public shutdown(): Promise<void>;

  /**
   * 
   * @param eventName 
   * @param listener 
   */
  public on<K extends keyof ClientEvents>(eventName: K, listener: (...args: ClientEvents[K]) => void): this;
  public once<K extends keyof ClientEvents>(eventName: K, listener: (...args: ClientEvents[K]) => void): this;
  public on<S extends string | symbol>(
    eventName: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => void,
  ): this;

  /**
   * The authentification info.
   * @type {Object}
   * @property {string} token - The token used to login.
   * @property {Object} room - The room info.
   * @property {string | null} room.id - The room ID.
   * @property {string | null} room.name - The room name.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * console.log(bot.auth.token); // The token used to login.
   * console.log(bot.auth.room.id); // The room ID.
  */
  public auth: {
    token: string;
    room: { id: string | null, name: string | null }
  }

  /**
   * The bot info.
   * @type {Object}
   * @property {Object} user - The user info.
   * @property {string | null} user.id - The user ID.
   * @property {Object} owner - The owner info.
   * @property {string | null} owner.id - The owner ID.
   * @property {string | null} connection_id - The connection ID.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * console.log(bot.info.user.id); // The bot ID.
   * console.log(bot.info.owner.id); // The owner ID.
   * console.log(bot.info.connection_id); // The connection ID.
  */
  public info: {
    user: { id: string | null },
    owner: { id: string | null },
    connection_id: string | null,
  }

  public player: Users;
  public room: { players: Players, voice: Voice, cache: Cache };
  public move: Move;
  public wallet: Wallet;
  public inventory: Inventory;
  public items: Items;
  public outfit: Outfit;
  public chat: AwaitMethods;
  public message: PublicMessage;
  public whisper: WhisperMessage;
  public invite: Invite;
  public direct: DirectMessage;
  public inbox: DirectMessages;
}

export class PublicMessage {
  constructor(bot: Highrise);

  /**
   * Send a public message.
   * @param {string} message - The message to send.
   * @returns {Promise<void>} - A promise that resolves when the message is sent.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise()
   * 
   * bot.message.send("Hello World!");
  */
  send(message: string): Promise<void>;
}

export class WhisperMessage {
  constructor(bot: Highrise);

  /**
   * Send a whisper message.
   * @param {string} user_id - The user ID to send the message to.
   * @param {string} message - The message to send.
   * @returns {Promise<void>} - A promise that resolves when the message is sent.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise()
   * 
   * bot.whisper.send("user ID", "Hello World!");
  */
  send(user_id: string, message: string): Promise<void>;
}

export class Invite {
  constructor(bot: Highrise);

  /**
   * Send a player room invite.
   * @param {string} conversation_id - The conversation ID to send the invite to.
   * @param {string} room_id - The room ID to invite the player to.
   * @returns {Promise<void>} - A promise that resolves when the invite is sent.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise()
   * 
   * bot.invite.send("conversation ID", "room ID");
   * // Note: You can only send a invite to those who have sent a message to the bot.
  */
  send(conversation_id: string, room_id: string): Promise<void>;
}

export class DirectMessage {
  constructor(bot: Highrise);

  /**
   * Send a direct message.
   * @param {string} conversation_id - The conversation ID to send the message to.
   * @param {string} message - The message to send.
   * @returns {Promise<void>} - A promise that resolves when the message is sent.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise()
   * 
   * bot.direct.send("conversation ID", "Hello World!");
   * // Note: You can only send a direct messages to those who have sent a message to the bot.
  */
  send(conversation_id: string, message: string): Promise<void>;
}

export class AwaitMethods {
  constructor(bot: Highrise);

  /**
   * Await a direct message;
   * @param {Object} options - The options for awaiting messages.
   * @param {function | null} options.filter - The filter function to use.
   * @param {number | null} options.max - The max amount of messages to await.
   * @param {number} options.timer - The time to await for.
   * @returns {Promise<Message[]>} - A promise that resolves with a collection of messages.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Await a direct message.
   * const filter = (player, id, msg) => {
   * if (player !== "PLAYER ID") retun false;
   * if (id !== "CONVERSATION ID") return false;
   * if (msg !== "MESSAGE CONTENT") return false;
   * return true;
   * }
   * 
   * const success = await bot.chat.awaitDirectMessages({ filter: filter, max: 1, idle: 15000});
   * if (!success.length) return bot.direct.send(conversation_id, "You did not send the correct message.");
   * // Do something with the message.
  */
  awaitDirectMessages(options: { filter: Function | null, max: number | null, timer: number }): Promise<Message[]>;

  /**
   * Await a emote;
   * @param {Object} options - The options for awaiting emotes.
   * @param {function | null} options.filter - The filter function to use.
   * @param {number | null} options.max - The max amount of emotes to await.
   * @param {number} options.timer - The time to await for.
   * @returns {Promise<Message[]>} - A promise that resolves with a collection of emotes.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Await a emote.
   * const filter = (s, r, e) => {
   * if (s.id !== "SENDER ID") return false;
   * if (r.id !== "RECEIVER ID") return false;
   * if (e !== 'EMOTE ID') return false;
   * return true;
   * }
   * 
   * const success = await bot.chat.awaitEmotes({ filter: filter, max: 1, idle: 15000});
   * if (!success.length) return bot.message.send("You did not send the correct emote.");
   * // Do something with the emote.
   */
  awaitEmotes(options: { filter: Function | null, max: number | null, timer: number }): Promise<Message[]>;

  /**
   * Await a tip.
   * @param {Object} options - The options for awaiting tips.
   * @param {function | null} options.filter - The filter function to use.
   * @param {number | null} options.max - The max amount of tips to await.
   * @param {number} options.timer - The time to await for.
   * @returns {Promise<Message[]>} - A promise that resolves with a collection of tips.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Await a tip.
   * const filter = (s, r, tip) => {
   * if (s.id !== "SENDER ID") return false;
   * if (r.id !== "RECEIVER ID") return false;
   * if (tip.amount !== 1) return false;
   * return true;
   * }
   * 
   * const success = await bot.chat.awaitTips({ filter: filter, max: 1, idle: 15000});
   * if (!success.length) return bot.message.send("You did not send the correct tip.");
   * // Do something with the tip.
   */
  awaitTips(options: { filter: Function, max: number, timer: number }): Promise<Message[]>;

  /**
   * Await a reaction.
   * @param {Object} options - The options for awaiting reactions.
   * @param {function | null} options.filter - The filter function to use.
   * @param {number | null} options.max - The max amount of reactions to await.
   * @param {number} options.timer - The time to await for.
   * @returns {Promise<Message[]>} - A promise that resolves with a collection of reactions.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Await a reaction.
   * const filter = (s, r, reaction) => {
   * if (s.id !== "SENDER ID") return false;
   * if (r.id !== "RECEIVER ID") return false;
   * if (reaction !== 'REACTION ID') return false;
   * return true;
   * }
   * 
   * const success = await bot.chat.awaitReactions({ filter: filter, max: 1, idle: 15000});
   * if (!success.length) return bot.message.send("You did not send the correct reaction.");
   * 
   * // Do something with the reaction.
   */
  awaitReactions(options: { filter: Function, max: number, timer: number }): Promise<Message[]>;


  /**
   * Await a message.
   * @param {Object} options - The options for awaiting messages.
   * @param {function | null} options.filter - The filter function to use.
   * @param {number | null} options.max - The max amount of messages to await.
   * @param {number} options.timer - The time to await for.
   * @returns {Promise<Message[]>} - A promise that resolves with a collection of messages.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Await a message.
   * const filter = (player, msg) => {
   * if (player !== "PLAYER ID") return false;
   * if (msg !== "MESSAGE CONTENT") return false;
   * return true;
   * }
   * 
   * const success = await bot.chat.awaitMessages({ filter: filter, max: 1, idle: 15000});
   * if (!success.length) return bot.message.send("You did not send the correct message.");
   * // Do something with the message.
   */
  awaitMessages(options: { filter: Function | null, max: number | null, timer: number }): Promise<Message[]>;
}

/**
 * List of available body parts.
 * @readonly
 * @enum {string}
*/
export enum BodyParts {
  Hair = "hair",
  Hair_Front = "hair_front",
  Hair_Back = "hair_back",
  Eyes = "eye",
  Eyebrow = "eyebrow",
  Lips = "mouth",
  Skin = "body",
}

export class Outfit {
  constructor(bot: Highrise);

  /**
   * Change the bot outfit
   * @param {Array<[]>} outfit - The outfit to change to.
   * @returns {Promise<void>} - A promise that resolves when the outfit is changed.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Change the bot outfit.
   * const outfit = [];
   * bot.outfit.change(outfit);
  */
  change: (outfit: Array<[]>) => Promise<void>;

  /**
   * Change the color of a body part
   * @param {BodyParts} BodyPart - The body part to change the color of.
   * @param {number} color - The color to change to.
   * 
   * @example
   * const { Highrise, BodyParts } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Change the color of a body part.
   * bot.outfit.color(BodyParts.Hair, 5);
  */
  color: (BodyPart: BodyParts, color: number) => Promise<void>;
}

export class Items {
  constructor(bot: Highrise);

  /**
   * Buy an item
   * @param {string} item_id - The item ID to buy.
   * @returns {Promise<void>} - A promise that resolves when the item is bought.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.items.buy(item_id).then((result) => {
   * console.log(result);
   * });
  */
  buy: (item_id: string) => Promise<void>;
}

export class Inventory {
  constructor(bot: Highrise);

  /**
   * Get the bot inventory
   * @returns {Promise<Item[]>} - A promise that resolves with the bot inventory.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.inventory.get().then(inventory => console.log(inventory));
  */
  get: () => Promise<Item[]>;
}

export class Wallet {
  constructor(bot: Highrise);

  /**
   * Get the bot balance
   * @returns {Promise<number>} - A promise that resolves with the bot balance.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.wallet.get().then(balance => console.log(balance));
  */
  get: () => Promise<CurrencyItem[]>;

  gold: {
    /**
     * Get the bot gold balance
     * @returns {Promise<number>} - A promise that resolves with the bot gold balance.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.wallet.gold.get().then(balance => console.log(balance));
    */
    get: () => Promise<CurrencyItem[]>;
  }

  boost: {
    /**
     * Get the bot boost balance
     * @returns {Promise<number>} - A promise that resolves with the bot boost balance.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.wallet.boost.get().then(balance => console.log(balance));
    */
    get: () => Promise<CurrencyItem[]>;

    /**
     * Buy a boost
     * @param {Prioreties} payment_method - The payment method to use.
     * @param {number} amount - The amount of boosts to buy.
     * @returns {Promise<void>} - A promise that resolves when the boost is bought.
     * 
     * @example
     * const { Highrise, Prioreties } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.wallet.boost.buy(Prioreties.BotWalletOnly, 1);
    */
    buy: (payment_method: Prioreties, amount: number) => Promise<void>;
  }

  voice: {
    /**
     * Get the bot voice balance
     * @returns {Promise<number>} - A promise that resolves with the bot voice balance.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.wallet.voice.get().then(balance => console.log(balance));
    */
    get: () => Promise<CurrencyItem[]>;

    /**
     * Buy a voice
     * @param {Prioreties} payment_method - The payment method to use.
     * @param {number} amount - The amount of voices to buy.
     * @returns {Promise<void>} - A promise that resolves when the voice is bought.
     * 
     * @example
     * const { Highrise, Prioreties } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.wallet.voice.buy(Prioreties.BotWalletOnly, 1);
    */
    buy: (payment_method: Prioreties, amount: number) => Promise<void>;
  }
}

export class DirectMessages {
  constructor(bot: Highrise);

  conversations: {
    /**
     * Get a list of conversations.
     * @param {boolean} user_joined - Whether to get conversations that the user has joined or not.
     * @param {string} last_id - The last ID to get conversations from.
     * @returns {Promise<Converstation[]>} - A promise that resolves with a collection of conversations.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * // Get a list of conversations that the user has joined.
     * bot.room.direct_messages.conversations.get(true, null).then(conversations => console.log(conversations));
     * 
     * // Get a list of conversations that the user has not joined.
     * bot.room.direct_messages.conversations.get(false, null).then(conversations => console.log(conversations));
     * 
     * // Get a list of conversations that the user has joined, starting from the last ID.
     * bot.room.direct_messages.conversations.get(true, "123").then(conversations => console.log(conversations));
    */
    get: (user_joined: boolean, last_id: string) => Promise<Converstation[]>;
  }

  messages: {
    /**
     * Get a list of messages from a conversation.
     * @param {string} conversation_id - The conversation ID to get messages from.
     * @param {string} last_message_id - The last message ID to get messages from.
     * @returns {Promise<Message[]>} - A promise that resolves with a collection of messages.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * // Get a list of messages from a conversation.
     * bot.room.direct_messages.messages.get(conversation_id, null).then(messages => console.log(messages));
     * 
     * // Get a list of messages from a conversation, starting from the last message ID.
     * bot.room.direct_messages.messages.get(conversation_id, "123").then(messages => console.log(messages));
    */
    get: (conversation_id: string, last_message_id: string) => Promise<Message[]>;
  }

  /**
   * Leave a conversation.
   * @param {string} conversation_id - The conversation ID to leave.
   * @returns {Promise<void>} - A promise that resolves when the conversation is left.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.room.direct_messages.leave(conversation_id);
  */
  leave: (conversation_id: string) => Promise<void>;
}

export class Voice {
  constructor(bot: Highrise);

  /**
   * Get list of players in the voice chat
   * @returns {Promise<VoiceChat[]>} - A promise that resolves with a collection of players in the voice chat.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.room.voice.fetch().then(players => console.log(players));
  */
  fetch: () => Promise<any[]>;

  get: {
    /**
     * Get the seconds left in the voice chat.
     * @returns {Promise<number>} - A promise that resolves with the seconds left in the voice chat.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.room.voice.get.seconds().then(seconds => console.log(seconds));
    */
    seconds: () => Promise<number>;

    /**
     * Get the users who has permissions to auto speak in the voice chat.
     * @returns {Promise<string[]>} - A promise that resolves with a collection of user IDs who has permissions to auto speak in the voice chat.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.room.voice.get.auto_speakers().then(auto_speakers => console.log(auto_speakers));
    */
    auto_speakers: () => Promise<string>;

    /**
     * Get a list of players who are activly speaking in the voice chat and not muted.
     * @returns {Promise<string[]>} - A promise that resolves with a collection of user IDs who are activly speaking in the voice chat and not muted.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.room.voice.get.active().then(active => console.log(active));
    */
    active: () => Promise<string>;

    /**
     * Get a list of players who are muted in the voice chat.
     * @returns {Promise<string[]>} - A promise that resolves with a collection of user IDs who are muted in the voice chat.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.room.voice.get.muted().then(muted => console.log(muted));
    */
    muted: () => Promise<string>;
  }
}

export class Cache {
  constructor(bot: Highrise);

  /**
   * Get list of players in the room
   * @returns {Promise<Collection<string, Player>>} - A promise that resolves with a collection of players.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.room.cache.get().then(players => console.log(players));
  */
  get: () => Promise<Collection<string, Players>>;

  /**
   * Get the position of a player.
   * @param {string} user_id - The user ID to get the position of.
   * @returns {Promise<Position>} - A promise that resolves with the position of the player.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Get the position of the user.
   * bot.room.cache.position(user_id).then(position => console.log(position));
  */
  position: (user_id: string) => Promise<Position>;

  /**
   * Get the username of a player.
   * @param {string} user_id - The user ID to get the username of.
   * @returns {Promise<string>} - A promise that resolves with the username of the player.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   *
   * // Get the username of the user.
   * bot.room.cache.username(user_id).then(username => console.log(username));
  */
  username: (user_id: string) => Promise<string>;

  /**
   * Get the user ID of a player.
   * @param {string} username - The username to get the user ID of.
   * @returns {Promise<string>} - A promise that resolves with the user ID of the player.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Get the user ID of the user.
   * bot.room.cache.id(username).then(user_id => console.log(user_id));
  */
  id: (username: string) => Promise<string>;

  /**
   * Get the size of the cache.
   * @returns {number} - The size of the cache.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Get the size of the cache.
   * bot.room.cache.size();
  */
  size: () => number;

  /**
   * Clear the cache.
   * @returns {void}
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Clear the cache.
   * bot.room.cache.clear();
  */
  clear: () => void;

  /**
   * Filter the cache.
   * @param {Function} fn - The filter function to use.
   * @returns {Collection<string, Player>} - A collection of players that passed the filter function.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Filter the cache.
   * bot.room.cache.filter(player => player.position.x === 0);
  */
  filter: (fn: (value: any, key: string, collection: Collection<string, any>) => boolean) => Collection<string, any>;

  /**
   * Find a player in the cache.
   * @param {Function} fn - The find function to use.
   * @returns {Player | undefined} - The player that passed the find function.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Find a player in the cache.
   * bot.room.cache.find(player => player.position.x === 0);
  */
  find: (fn: (value: any, key: string, collection: Collection<string, any>) => boolean) => any | undefined;

  /**
   * Map the cache.
   * @param {Function} fn - The map function to use.
   * @returns {unknown[]} - An array of values that passed the map function.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Map the cache.
   * bot.room.cache.map(player => player.position.x);
  */
  map: (fn: (value: any, key: string, collection: Collection<string, any>) => unknown) => unknown[];
}

export class Players {
  constructor(bot: Highrise);

  /**
   * Get list of players in the room
   * @returns {Promise<Collection<string, Player>>} - A promise that resolves with a collection of players.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.room.players.get().then(players => console.log(players));
  */
  get: () => Promise<Collection<string, any[]>>;

  /**
   * Get the position of a player.
   * @param {string} user_id - The user ID to get the position of.
   * @returns {Promise<Position>} - A promise that resolves with the position of the player.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Get the position of the user.
   * bot.room.players.position(user_id).then(position => console.log(position));
  */
  position: (user_id: string) => Promise<Position>;

  /**
   * Get the username of a player.
   * @param {string} user_id - The user ID to get the username of.
   * @returns {Promise<string>} - A promise that resolves with the username of the player.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   *
   * // Get the username of the user.
   * bot.room.players.username(user_id).then(username => console.log(username));
  */
  username: (user_id: string) => Promise<string>;

  /**
   * Get the user ID of a player.
   * @param {string} username - The username to get the user ID of.
   * @returns {Promise<string>} - A promise that resolves with the user ID of the player.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * // Get the user ID of the user.
   * bot.room.players.id(username).then(user_id => console.log(user_id));
  */
  id: (username: string) => Promise<string>;
}

export class Move {
  constructor(bot: Highrise);

  /**
   * Move the bot to a position.
   * @param {number} x - The x position to move to.
   * @param {number} y - The y position to move to.
   * @param {number} z - The z position to move to.
   * @param {Facing} facing - The facing direction to move to.
   * 
   * @example
   * const { Highrise, Facing } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.move.walk(1, 0, 1, Facing.FrontRight);
   */
  walk: (x: number, y: number, z: number, facing: Facing) => Promise<void>;

  /**
   * Make the bot sit at entity.
   * @param {string} entity_id - The entity ID to sit at.
   * @param {number} anchor_ix - The anchor index to sit at.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.move.sit(entity_id, 0);
  */
  sit: (entity_id: string, anchor_ix: number) => Promise<void>;
}

export class Users {
  constructor(bot: Highrise);
  /**
   * Perform emote on a user.
   * @param {string | null} user_id - The user ID to perform the emote on. If this is null, the emote will be performed on the bot.
   * @param {Emotes} emote_id - The emote ID to perform.
   * 
   * @example
   * const { Highrise, Emotes } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.player.emote(user_id, Emotes.Confused.id);
  */
  emote: (user_id: string | null, emote_id: string) => Promise<void>;

  /**
   * Perform reaction on a user.
   * @param {string | null} user_id - The user ID to perform the reaction on.
   * @param {Reactions} reaction_id - The reaction ID to perform.
   * 
   * @example
   * const { Highrise, Reactions } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.player.react(user_id, Reactions.Clap);
  */
  react: (user_id: string, reaction_id: Reactions) => Promise<void>;

  /**
   * Tip a user.
   * @param {string} user_id - The user ID to tip.
   * @param {GoldBars} amount - The amount of gold bars to tip.
   * 
   * @example
   * const { Highrise, GoldBars } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.player.tip(user_id, GoldBars.Gold_Bar_1);
  */
  tip: (user_id: string, amount: GoldBars) => Promise<void>;

  /**
   * Teleport a player
   * @param {string | null} user_id - The user ID to teleport. If this is null, the bot will be teleported.
   * @param {number} x - The x position to teleport to.
   * @param {number} y - The y position to teleport to.
   * @param {number} z - The z position to teleport to.
   * @param {string} facing - The facing direction to teleport to.
   * 
   * @example
   * const { Highrise, Facing } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.player.teleport(user_id, 0, 0, 0, Facing.FrontRight);
  */
  teleport: (user_id: string | null, x: number, y: number, z: number, facing: Facing) => Promise<void>;

  /**
   * Transport a player to a room.
   * @param {string} user_id - The user ID to transport.
   * @param {string} room_id - The room ID to transport to.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.player.transport(user_id, room_id);
   */
  transport: (user_id: string, room_id: string) => Promise<void>;

  voice: {
    /**
     * Add a user to the voice chat.
     * @param {string} user_id - The user ID to add to the voice chat.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.player.voice.add(user_id);
     */
    add: (user_id: string) => Promise<void>;

    /**
     * Remove a user from the voice chat.
     * @param {string} user_id - The user ID to remove from the voice chat.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.player.voice.remove(user_id);
     */
    remove: (user_id: string) => Promise<void>;
  }

  /**
   * Kick a user from the room.
   * @param {string} user_id - The user ID to kick from the room.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.player.kick(user_id);
   */
  kick: (user_id: string) => Promise<void>;

  /**
   * Ban a user from the room.
   * @param {string} user_id - The user ID to ban from the room.
   * @param {number} seconds - The amount of seconds to ban the user for.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.player.ban(user_id, 60);
  */
  ban: (user_id: string, seconds: number) => Promise<void>;

  /**
   * Mute a user from the room.
   * @param {string} user_id - The user ID to mute from the room.
   * @param {number} seconds - The amount of seconds to mute the user for.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.player.mute(user_id, 60);
  */
  mute: (user_id: string, seconds: number) => Promise<void>;

  /**
   * Unban a user from the room.
   * @param {string} user_id - The user ID to unban from the room.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.player.unban(user_id);
  */
  unban: (user_id: string) => Promise<void>;

  /**
   * Unmute a user from the room.
   * @param {string} user_id - The user ID to unmute from the room.
   * 
   * @example
   * const { Highrise } = require("highrise.sdk.dev");
   * const bot = new Highrise();
   * 
   * bot.player.unmute(user_id);
  */
  unmute: (user_id: string) => Promise<void>;

  permissions: {
    /**
     * Get the permissions of a user.
     * @param {string} user_id - The user ID to get the permissions of.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.player.permissions.get(user_id);
    */
    get: (user_id: string) => Promise<RoomPermissions>;
  }

  moderator: {
    /**
     * Add a user as a moderator.
     * @param {string} user_id - The user ID to add as a moderator.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.player.moderator.add(user_id);
    */
    add: (user_id: string) => Promise<void>;

    /**
     * Remove a user as a moderator.
     * @param {string} user_id - The user ID to remove as a moderator.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.player.moderator.remove(user_id);
    */
    remove: (user_id: string) => Promise<void>;
  }

  designer: {
    /**
     * Add a user as a designer.
     * @param {string} user_id - The user ID to add as a designer.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.player.designer.add(user_id);
    */
    add: (user_id: string) => Promise<void>;

    /**
     * Remove a user as a designer.
     * @param {string} user_id - The user ID to remove as a designer.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * bot.player.designer.remove(user_id);
    */
    remove: (user_id: string) => Promise<void>;
  }

  outfit: {
    /**
     * Get the outfit of a user.
     * @param {string | null} user_id - The user ID to get the outfit of. If this is null, the bot's outfit will be retrieved.
     * 
     * @example
     * const { Highrise } = require("highrise.sdk.dev");
     * const bot = new Highrise();
     * 
     * // Get the outfit of the bot.
     * bot.player.outfit.get(null).then(outfit => console.log(outfit));
     * 
     * // Get the outfit of the user.
     * bot.player.outfit.get(user_id).then(outfit => console.log(outfit));
    */
    get: (user_id: string | null) => Promise<Outfit>;
  }
}

/**
 * List of free emotes that can be used on all users.
 * @readonly
 * @enum {string}
 */
export const Emotes = {
  Kiss: { id: "emote-kiss", duration: 3 },
  Laughing: { id: "emote-laughing", duration: 3 },
  Sitting: { id: "idle-loop-sitfloor", duration: 10 },
  Lust: { id: "emote-lust", duration: 5 },
  Cursing: { id: "emoji-cursing", duration: 2.5 },
  Greedy: { id: "emote-greedy", duration: 4.8 },
  Flexing: { id: "emoji-flex", duration: 3 },
  Gagging: { id: "emoji-gagging", duration: 6 },
  Celebrating: { id: "emoji-celebrate", duration: 4 },
  Macarena_Dance: { id: "dance-macarena", duration: 12.5 },
  TikTok_Dance_8: { id: "dance-tiktok8", duration: 11 },
  Blackpink_Dance: { id: "dance-blackpink", duration: 7 },
  Modeling: { id: "emote-model", duration: 6.3 },
  TikTok_Dance_2: { id: "dance-tiktok2", duration: 11 },
  Pennywise_Dance: { id: "dance-pennywise", duration: 1.5 },
  Bow: { id: "emote-bow", duration: 3.3 },
  Russian_Dance: { id: "dance-russian", duration: 10.3 },
  Curtsy: { id: "emote-curtsy", duration: 2.8 },
  Snowball_Fight: { id: "emote-snowball", duration: 6 },
  Feeling_Hot: { id: "emote-hot", duration: 4.8 },
  Making_A_Snow_Angel: { id: "emote-snowangel", duration: 6.8 },
  Charging: { id: "emote-charging", duration: 8.5 },
  Shopping_Cart_Dance: { id: "dance-shoppingcart", duration: 5 },
  Confused: { id: "emote-confused", duration: 9.3 },
  Enthusiastic: { id: "idle-enthusiastic", duration: 16.5 },
  Telekinesis: { id: "emote-telekinesis", duration: 11 },
  Floating: { id: "emote-float", duration: 9.3 },
  Teleporting: { id: "emote-teleporting", duration: 12.5 },
  Swordfight: { id: "emote-swordfight", duration: 6 },
  Maniac: { id: "emote-maniac", duration: 5.5 },
  Energy_Ball: { id: "emote-energyball", duration: 8.3 },
  Snake: { id: "emote-snake", duration: 6 },
  Singing: { id: "idle_singing", duration: 11 },
  Frog: { id: "emote-frog", duration: 15 },
  Superpose: { id: "emote-superpose", duration: 4.6 },
  Cute: { id: "emote-cute", duration: 7.3 },
  TikTok_Dance_9: { id: "dance-tiktok9", duration: 13 },
  Weird_Dance: { id: "dance-weird", duration: 22 },
  TikTok_Dance_10: { id: "dance-tiktok10", duration: 9 },
  Pose_7: { id: "emote-pose7", duration: 5.3 },
  Pose_8: { id: "emote-pose8", duration: 4.6 },
  Casual_Dance: { id: "idle-dance-casual", duration: 9.7 },
  Pose_1: { id: "emote-pose1", duration: 3 },
  Pose_3: { id: "emote-pose3", duration: 4.7 },
  Pose_5: { id: "emote-pose5", duration: 5 },
  Cutey: { id: "emote-cutey", duration: 3.5 },
  Punk_Guitar: { id: "emote-punkguitar", duration: 10 },
  Zombie_Run: { id: "emote-zombierun", duration: 10 },
  Fashionista: { id: "emote-fashionista", duration: 6 },
  Gravity: { id: "emote-gravity", duration: 9.8 },
  Ice_Cream_Dance: { id: "dance-icecream", duration: 15 },
  Wrong_Dance: { id: "dance-wrong", duration: 13 },
  UwU: { id: "idle-uwu", duration: 25 },
  TikTok_Dance_4: { id: "idle-dance-tiktok4", duration: 16 },
  Advanced_Shy: { id: "emote-shy2", duration: 5 },
  Anime_Dance: { id: "dance-anime", duration: 7.8 },
} as const;


/**
 * List of available facing directions.
 * @readonly
 * @enum {string}
 */
export enum Facing {
  FrontRight = 'FrontRight',
  FrontLeft = 'FrontLeft',
  BackRight = 'BackRight',
  BackLeft = 'BackLeft'
}

/**
 * List of available reactions.
 * @readonly
 * @enum {string}
 */
export enum Reactions {
  Clap = 'clap',
  Heart = 'heart',
  Thumbs = 'thumbs',
  Wave = 'wave',
  Wink = 'wink'
}

/**
 * List of available wallet priorities.
 * @readonly
 * @enum {string}
 */
export enum Prioreties {
  BotWalletOnly = 'bot_wallet_only',
  BotWalletAndUser = 'bot_wallet_priority',
  UserWalletOnly = 'user_wallet_only'
}

/**
 * List of available gold bars.
 * @readonly
 * @enum {number}
 */
export enum GoldBars {
  BAR_1 = 1,
  BAR_5 = 5,
  BAR_10 = 10,
  BAR_50 = 50,
  BAR_100 = 100,
  BAR_500 = 500,
  BAR_1k = 1000,
  BAR_5k = 5000,
  BAR_10k = 10000,
}

/**
 * WebApi Methods
 * @readonly
*/
export const WebApi = new class {

  /**
  * Retrieve the profile of a user.
  *
  * @param {string} id - The user's ID.
  * @returns {Object} The user's profile.
  * 
  * @example
  * const { WebApi } = require("highrise.sdk.dev");
  * WebApi.getUserById(user_id).then(user => console.log(user));
  */
  getUserById(id: string): Promise<User>;

  /**
   * Retrieve the profile of a user.
   * @param {string} name - The user's username.
   * @returns {Object} The user's profile.
   *  
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * WebApi.getUserByName("iHsein").then(user => console.log(user));
   * 
  */
  getUserByName(name: string): Promise<User>;

  /**
  * Retrieves users from the API based on the specified parameters.
  *
  * @param {string|null} username - The username to filter the users by.
  * @param {number} limit - The maximum number of users to retrieve.
  * @param {string|null} starts_after - The user ID to start retrieving users after.
  * @param {string|null} ends_before - The user ID to end retrieving users before.
  * @param {SortOrder} sort_order - The sort order for the retrieved users.
  * @returns {Promise<object|null>} - A promise that resolves with the retrieved users or null.
  * 
  * @example
  * const { WebApi } = require("highrise.sdk.dev");
  * // Retrieve the user with the username "iHsein".
  * WebApi.getUsers("iHsein", 1).then(users => console.log(users));
  * 
  * // Retrieve the first user that starts after the user with the ID user_id.
  * WebApi.getUsers(null, 1, user_id).then(users => console.log(users));
  * 
  * // Retrieve the first user that ends before the user with the ID user_id.
  * WebApi.getUsers(null, 1, null, user_id).then(users => console.log(users));
  * 
  * // Retrieve all the users in descending order.
  * WebApi.getUsers(null, 1, null, null, "desc").then(users => console.log(users));
  * 
  * // Retrieve the first 100 users.
  * WebApi.getUsers(null, 100).then(users => console.log(users));
  */
  getUsers(username?: string | null, limit?: number, starts_after?: string | null, ends_before?: string | null, sort_order?: SortOrder): Promise<object | null>;

  /**
   * Retrieves the profile of a room.
   * @param {string} id - The room's ID.
   * @returns {Object} The room's profile.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * WebApi.getRoomById("6522ad66f96c4009eb55d5a7").then(room => console.log(room));
  **/
  getRoomById(id: string): Promise<any[]>;

  /**
  * Retrieves the profile of a room.
  * @param {string} owner_id - The owner's ID.
  * @param {string} name - The room's name.
  * @returns {Object} The room's profile.
  * 
  * @example
  * const { WebApi } = require("highrise.sdk.dev");
  * WebApi.getRoomByName(user_id, "iHsein's Room").then(room => console.log(room));
 **/
  getRoomByName(owner_id: string, name: string): Promise<any[]>;

  /**
   * Retrieves the profile of a room.
   * @param {string} owner_id - The owner's ID.
   * @param {number} limit - The maximum number of rooms to retrieve.
   * @param {string|null} starts_after - The room ID to start retrieving rooms after.
   * @param {string|null} ends_before - The room ID to end retrieving rooms before.
   * @param {SortOrder} sort_order - The sort order for the retrieved rooms.
   * @returns {Promise<object|null>} - A promise that resolves with the retrieved rooms or null.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * // Retrieve the room with the owner ID user_id.
   * WebApi.getRooms(user_id, 1).then(rooms => console.log(rooms));
   * 
   * // Retrieve the first room that starts after the room with the ID "6522ad66f96c4009eb55d5a7".
   * WebApi.getRooms(null, 1, "6522ad66f96c4009eb55d5a7").then(rooms => console.log(rooms));
   * 
   * // Retrieve the first room that ends before the room with the ID "6522ad66f96c4009eb55d5a7".
   * WebApi.getRooms(null, 1, null, "6522ad66f96c4009eb55d5a7").then(rooms => console.log(rooms));
   * 
   * // Retrieve all the rooms in descending order.
   * WebApi.getRooms(null, 1, null, null, "desc").then(rooms => console.log(rooms));
   * 
   * // Retrieve the first 100 rooms.
   * WebApi.getRooms(null, 100).then(rooms => console.log(rooms));
   * 
   * // Retrieve the first 20 rooms for the user with the ID user_id.
   * WebApi.getRooms(user_id, 20).then(rooms => console.log(rooms));
  **/
  getRooms(owner_id?: string | null, limit?: number, starts_after?: string | null, ends_before?: string | null, sort_order?: SortOrder): Promise<object | null>;

  /**
   * Retrieves the profile of a post.
   * @param {string} id - The post's ID.
   * @returns {Object} The post's profile.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * WebApi.getPostById("65134fe40b9cf4e4026aa5b4").then(post => console.log(post));
   * 
  */
  getPostById(id: string): Promise<any>;

  /**
    * Retrieves user posts
   * @param {string} author_id - The author's ID.
   * @param {number} limit - The maximum number of posts to retrieve.
   * @param {string|null} starts_after - The post ID to start retrieving posts after.
   * @param {string|null} ends_before - The post ID to end retrieving posts before.
   * @param {SortOrder} sort_order - The sort order for the retrieved posts.
   * @returns {Promise<object|null>} - A promise that resolves with the retrieved posts or null.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * // Retrieve the post with the author ID user_id.
   * WebApi.getPosts(user_id, 1).then(posts => console.log(posts));
   * 
   * // Retrieve the first post that starts after the post with the ID "65134fe40b9cf4e4026aa5b4".
   * WebApi.getPosts(null, 1, "65134fe40b9cf4e4026aa5b4").then(posts => console.log(posts));
   * 
   * // Retrieve the first post that ends before the post with the ID "65134fe40b9cf4e4026aa5b4".
   * WebApi.getPosts(null, 1, null, "65134fe40b9cf4e4026aa5b4").then(posts => console.log(posts));
   * 
   * // Retrieve all the posts in descending order.
   * WebApi.getPosts(null, 1, null, null, "desc").then(posts => console.log(posts));
   * 
   * // Retrieve the first 100 posts.
   * WebApi.getPosts(null, 100).then(posts => console.log(posts));
  */
  getPosts(author_id: string, limit?: number, starts_after?: string | null, ends_before?: string | null, sort_order?: SortOrder): Promise<object | null>;

  /**
   * Retrieves the profile of a grab.
   * @param {string} id - The grab's ID.
   * @returns {Object} The grab's profile.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * WebApi.getGrab("655270f3712573254c14a8a5").then(grab => console.log(grab));
  */
  getGrab(id: string): Promise<any[]>;

  /**
  * Retrieves game grabs
  * @param {number} limit - The maximum number of grabs to retrieve.
  * @param {string|null} title - The grab title to filter the grabs by.
  * @param {string|null} starts_after - The grab ID to start retrieving grabs after.
  * @param {string|null} ends_before - The grab ID to end retrieving grabs before.
  * @param {SortOrder} sort_order - The sort order for the retrieved grabs.
  * @returns {Promise<object|null>} - A promise that resolves with the retrieved grabs or null.
  * 
  * @example
  * const { WebApi } = require("highrise.sdk.dev");
  * // Retrieve the first grab that starts after the grab with the ID "655270f3712573254c14a8a5".
  * WebApi.getGrabs(1, null, "655270f3712573254c14a8a5").then(grabs => console.log(grabs));
  * 
  * // Retrieve the first grab that ends before the grab with the ID "655270f3712573254c14a8a5".
  * WebApi.getGrabs(1, null, null, "655270f3712573254c14a8a5").then(grabs => console.log(grabs));
  * 
  * // Retrieve all the grabs in descending order.
  * WebApi.getGrabs(1, null, null, null, "desc").then(grabs => console.log(grabs));
  * 
  * // Retrieve the first 100 grabs.
  * WebApi.getGrabs(100).then(grabs => console.log(grabs));
  * 
  * // Retrieve the first 100 grabs with the title "Sugar High".
  * WebApi.getGrabs(100, "Sugar High").then(grabs => console.log(grabs));
 */
  getGrabs(limit?: number | null, title?: string | null, starts_after?: string | null, ends_before?: string | null, sort_order?: SortOrder): Promise<object | null>;

  /**
   * Retrieves the profile of an item.
   * @param {string} id - The item's ID.
   * @returns {Object} The item's profile.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * WebApi.getItemById("watch-n_techcrewrewards2019fitnesstracker").then(item => console.log(item));
  */
  getItemById(id: string): Promise<Item>;

  /**
   * Retrieves game items
   * @param {number} limit - The maximum number of items to retrieve.
   * @param {Categories|null} category - The item category to filter the items by.
   * @param {string|null} rarity - The item rarity to filter the items by.
   * @param {string|null} item_name - The item name to filter the items by.
   * @param {string|null} starts_after - The item ID to start retrieving items after.
   * @param {string|null} ends_before - The item ID to end retrieving items before.
   * @param {SortOrder} sort_order - The sort order for the retrieved items.
   * @returns {Promise<object|null>} - A promise that resolves with the retrieved items or null.
   */
  getItems(limit?: number | null, category?: Categories | null, rarity?: Rarity | null, item_name?: string | null, starts_after?: string | null, ends_before?: string | null, sort_order?: SortOrder): Promise<object | null>;

  /**
   * Search for items
   * @param {number} limit - The maximum number of items to retrieve.
   * @param {number} skip - The number of items to skip.
   * @param {string} query - The query to search for.
   * @returns {Promise<object|null>} - A promise that resolves with the retrieved items or null.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * // Retrieve the first 100 items.
   * WebApi.searchItem(100).then(items => console.log(items));
   * 
   * // Retrieve the first 100 items that start with "watch".
   * WebApi.searchItem(100, 0, "watch").then(items => console.log(items));
   * 
   * // Retrieve the first 100 items that start with "watch" and skip the first 10 items.
   * WebApi.searchItem(100, 10, "watch").then(items => console.log(items));
  */
  searchItem(limit?: number | null, skip?: number | null, query?: string | null): Promise<object | null>;
}();

/**
 * Options for configuring the WelcomeBot.
 */
export interface WelcomeBotOptions {
  auth: {
    token: string;
    room_id: string;
  },

  settings?: {
    prefix: string;
    spawn: {
      enabled: boolean;
      coordinates: object;
      object: object;
      action: "walk" | "sit" | "teleport" | "teleport-walk" | "teleport-sit";
    },
    commands: {
      enabled: boolean;
      list: object; // {command: {enabled: boolean, message: string, reply: "public" | "whisper"}}
    }
  },

  joined?: {
    enabled: boolean;
    message: string;
    type: "public" | "whisper";
  }

  left?: {
    enabled: boolean;
    message: string;
  }

  logs?: {
    welcome: boolean;
    goodbye: boolean;
    messages: boolean;
  }
}

/**
 * A bot that sends welcome and goodbye messages when users join and leave a room.
 */
export class WelcomeBot {
  options: WelcomeBotOptions;

  /**
   * The Highrise instance used by the bot.
  */
  bot: Highrise;

  /**
   * Creates a new WelcomeBot.
   * @param options The options used to configure the bot.
   */
  constructor(options: WelcomeBotOptions);

  /**
   * Handles a user joining.
   * @param user The user who joined.
   */
  onJoin(user: User): void;

  /**
   * Handles a user leaving.
   * @param user The user who left.
   */
  onLeave(user: User): void;

  /**
   * Send a message to the room.
   * @param type The type of message to send.
   * @param message The message to send.
   * @param user The user to send the message to.
  */
  sendMessage: (type: "public" | "private", message: string, user: User) => void;
}


/**
 * Options for configuring the DanceFloor.
 * @interface
 * @property {number} duration - The interval in seconds to check for players in the dance floor.
 * @property {boolean} enabled - Enable or disable the dance floor.
 * @property {Array<Emotes>} emotes - The emotes to perform on the players.
 * @property {number} groupSize - The size of the groups to split the players into.
 * @property {number} delay - The delay for group emotes in seconds.
 * @property {object} parameter - The parameters for the dance floor.
 * @property {number} parameter.minX - The minimum x position of the dance floor.
 * @property {number} parameter.maxX - The maximum x position of the dance floor.
 * @property {number} parameter.minY - The minimum y position of the dance floor.
 * @property {number} parameter.maxY - The maximum y position of the dance floor.
 * @property {number} parameter.minZ - The minimum z position of the dance floor.
 * @property {number} parameter.maxZ - The maximum z position of the dance floor.
 */
export interface DanceFloorOptions {
  /*
  * The interval in seconds to check for players in the dance floor.
  * @default 10
  */
  duration: number;
  /*
  * Enable or disable the dance floor.
  * @default false
  */
  enabled: boolean;
  /*
  * The emotes to perform on the players.
  * @default emotes provided by the community
  */
  emotes: Array<any[]>;
  /*
  * The size of the groups to split the players into.
  * @default 5
  */
  groupSize: number;
  /*
  * The delay for group emotes in seconds.
  * @default 10
  */
  delay: number;

  /**
   * The parameters for the dance floor.
   * @param {number} minX - The minimum x position of the dance floor.
   * @param {number} maxX - The maximum x position of the dance floor.
   * @param {number} minY - The minimum y position of the dance floor.
   * @param {number} maxY - The maximum y position of the dance floor.  
   * @param {number} minZ - The minimum z position of the dance floor.
   * @param {number} maxZ - The maximum z position of the dance floor.
  */
  parameter: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  }
}

export class DanceFloor {
  constructor(bot: Highrise, options: DanceFloorOptions);

  create: () => void;
  fetchPlayers: () => Promise<Array<any[]>>;
  isInArea: (poition: Position) => boolean;
  splitIntoGroups: (player: Array<any[]>, size: number) => Array<Array<any[]>>;
}

export class Tools {
  static DanceFloor: typeof DanceFloor;
}