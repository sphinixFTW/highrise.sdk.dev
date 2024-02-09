'use strict';
const { HighriseTypeError, ErrorCodes, HighrisejsError } = require("../../errors");
const Collection = require("../../utils/Collection");

class AwaitRequest {
  constructor(bot) {
    this.bot = bot;
    this.messageListeners = new Collection();
    this.directMessageListeners = new Collection();
    this.reactionListeners = new Collection();
    this.tipListeners = new Collection();
    this.emoteListeners = new Collection();

    this.events = bot.Events || [];

    if (this.events.includes('ChatEvent')) {
      this.bot.on('chatCreate', this.handleChatMessage.bind(this));
      this.bot.on('whisperCreate', this.handleChatMessage.bind(this));
    }

    if (this.events.includes('ReactionEvent')) {
      this.bot.on('playerReact', this.handleReaction.bind(this));
    }

    if (this.events.includes('TipReactionEvent')) {
      this.bot.on('playerTip', this.handleTip.bind(this));
    }

    if (this.events.includes('EmoteEvent')) {
      this.bot.on('playerEmote', this.handleEmote.bind(this));
    }

    if (this.events.includes('MessageEvent')) {
      this.bot.on('messageCreate', this.handleDirectMessage.bind(this));
    }
  }

  // Direct Message Listener
  async handleDirectMessage(user, data, message) {
    for (const listener of this.directMessageListeners.keys()) {
      listener(user, data.id, message);
    }
  }

  awaitDirectMessages(options) {
    if (!this.bot.AutoFetchMessages) throw new HighrisejsError(ErrorCodes.ClientMissingOptions, 'AutoFetchMessages');
    if (!this.events.includes('MessageEvent')) throw new HighrisejsError(ErrorCodes.EventNotEnabled, 'MessageEvent');
    if (!options) throw new HighriseTypeError(ErrorCodes.NoOptionsProvided);

    const { filter, max = 1, idle = 30000 } = options;

    if (filter && typeof filter !== 'function') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'filter', 'function');
    if (idle && typeof idle !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'idle', 'number');
    if (max && typeof max !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'max', 'number');

    return new Promise((resolve) => {
      let timer;
      let collected = [];
      let uniqueUsers = new Set();

      const listener = async (user_id, conversation_id, message) => {
        if ((!filter || filter(user_id, conversation_id, message)) && !uniqueUsers.has(user_id)) {
          collected.push({ user_id, conversation_id, content: message.trim() });
          uniqueUsers.add(user_id);
        }

        if (max && collected.length >= max) {
          clearTimeout(timer);
          this.removeDirectMessageListener(listener);
          resolve(collected);
        }
      }

      this.addDirectMessageListener(listener);
      timer = setTimeout(() => {
        this.removeDirectMessageListener(listener);
        resolve(collected);
      }, idle);
    });
  }

  addDirectMessageListener(listener) {
    this.directMessageListeners.set(listener, true);
  }

  removeDirectMessageListener(listener) {
    this.directMessageListeners.delete(listener);
  }

  // Emote Listener
  handleEmote(sender, receiver, emote) {
    for (const listener of this.emoteListeners.keys()) {
      listener(sender, receiver, emote);
    }
  }

  addEmoteListener(listener) {
    this.emoteListeners.set(listener, true);
  }

  removeEmoteListener(listener) {
    this.emoteListeners.delete(listener);
  }

  awaitEmotes(options) {
    if (!this.events.includes('EmoteEvent')) throw new HighrisejsError(ErrorCodes.EventNotEnabled, 'EmoteEvent');
    if (!options) throw new HighriseTypeError(ErrorCodes.NoOptionsProvided);
    const { filter, max = 1, idle = 30000 } = options;

    if (filter && typeof filter !== 'function') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'filter', 'function');
    if (idle && typeof idle !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'idle', 'number');
    if (max && typeof max !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'max', 'number');

    return new Promise((resolve) => {
      let timer;
      let collected = [];
      let uniqueUsers = new Set();

      const listener = (sender, receiver, emote) => {
        if ((!filter || filter(sender, receiver, emote)) && !uniqueUsers.has(sender.id)) {
          collected.push({ sender, receiver, emote });
          uniqueUsers.add(sender.id);
        }

        if (max && collected.length >= max) {
          clearTimeout(timer);
          this.removeEmoteListener(listener);
          resolve(collected);
        }
      };

      this.addEmoteListener(listener);

      timer = setTimeout(() => {
        this.removeEmoteListener(listener);
        resolve(collected);
      }, idle);
    });
  }

  // Tip Listener
  handleTip(sender, receiver, amount) {
    for (const listener of this.tipListeners.keys()) {
      listener(sender, receiver, amount);
    }
  }

  addTipListener(listener) {
    this.tipListeners.set(listener, true);
  }

  removeTipListener(listener) {
    this.tipListeners.delete(listener);
  }

  awaitTips(options) {
    if (!this.events.includes('TipReactionEvent')) throw new HighrisejsError(ErrorCodes.EventNotEnabled, 'TipReactionEvent');
    if (!options) throw new HighriseTypeError(ErrorCodes.NoOptionsProvided);
    const { filter, max = 1, idle = 30000 } = options;

    if (filter && typeof filter !== 'function') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'filter', 'function');
    if (idle && typeof idle !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'idle', 'number');
    if (max && typeof max !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'max', 'number');

    return new Promise((resolve) => {
      let timer;
      let collected = [];

      const listener = (sender, receiver, item) => {
        if (!filter || filter(sender, receiver, item)) {
          collected.push({ sender, receiver, item });

          if (max && collected.length >= max) {
            clearTimeout(timer);
            this.removeTipListener(listener);
            resolve(collected);
          }
        }
      };

      this.addTipListener(listener);

      timer = setTimeout(() => {
        this.removeTipListener(listener);
        resolve(collected);
      }, idle);
    });
  }

  // Reaction Listener
  handleReaction(sender, receiver, reaction) {
    for (const listener of this.reactionListeners.keys()) {
      listener(sender, receiver, reaction);
    }
  }

  addReactionListener(listener) {
    this.reactionListeners.set(listener, true);
  }

  removeReactionListener(listener) {
    this.reactionListeners.delete(listener);
  }

  awaitReactions(options) {
    if (!this.events.includes('ReactionEvent')) throw new HighrisejsError(ErrorCodes.EventNotEnabled, 'ReactionEvent');
    if (!options) throw new HighriseTypeError(ErrorCodes.NoOptionsProvided);
    const { filter, max = 1, idle = 30000 } = options;

    if (filter && typeof filter !== 'function') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'filter', 'function');
    if (idle && typeof idle !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'idle', 'number');
    if (max && typeof max !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'max', 'number');

    return new Promise((resolve) => {
      let timer;
      let collected = [];
      let uniqueUsers = new Set();

      const listener = (sender, receiver, reaction) => {
        if ((!filter || filter(sender, receiver, reaction)) && !uniqueUsers.has(sender.id)) {
          collected.push({ sender, receiver, reaction });
          uniqueUsers.add(sender.id);
        }

        if (max === true && collected.length >= uniqueUsers.size) {
          clearTimeout(timer);
          this.removeReactionListener(listener);
          resolve(collected);
        }
      };

      this.addReactionListener(listener);

      timer = setTimeout(() => {
        this.removeReactionListener(listener);
        resolve(collected);
      }, idle);
    });
  }


  // Message Listener
  handleChatMessage(user, message) {
    for (const listener of this.messageListeners.keys()) {
      listener(user, message);
    }
  }

  addMessageListener(listener) {
    this.messageListeners.set(listener, true);
  }

  removeMessageListener(listener) {
    this.messageListeners.delete(listener);
  }

  awaitMessages(options) {
    if (!this.events.includes('ChatEvent')) throw new HighrisejsError(ErrorCodes.EventNotEnabled, 'ChatEvent');
    if (!options) throw new HighriseTypeError(ErrorCodes.NoOptionsProvided);

    const { filter, max = 1, idle = 30000 } = options;

    if (filter && typeof filter !== 'function') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'filter', 'function');
    if (idle && typeof idle !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'idle', 'number');
    if (max && typeof max !== 'number') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, 'max', 'number');

    return new Promise((resolve) => {
      let timer;
      let collected = [];
      let uniqueUsers = new Set();

      const listener = (user, message) => {
        if ((!filter || filter(user, message)) && !uniqueUsers.has(user.id)) {
          collected.push({ user, message });
          uniqueUsers.add(user.id);
        }

        if (max && collected.length >= max) {
          clearTimeout(timer);
          this.removeMessageListener(listener);
          resolve(collected);
        }
      }

      this.addMessageListener(listener);

      if (idle) {
        timer = setTimeout(() => {
          this.removeMessageListener(listener);
          resolve(collected);
        }, idle);
      }
    })
  }
}

module.exports = AwaitRequest;