'use strict';
const { Highrise, Events, Collection } = require("../index");

module.exports = class WelcomeBot {
  constructor(options = {}) {

    if (!options.auth) throw new Error('No auth provided');
    if (!options.auth.token) throw new Error('No token provided');
    if (!options.auth.room_id) throw new Error('No room provided');

    if (!options.joined) options.joined = { enabled: true, message: '{{user}} has joined the room!', type: 'public' };
    if (!options.left) options.left = { enabled: true, message: '{{user}} has left the room!' };

    if (!options.settings) options.settings = {
      prefix: '!',
      spawn: {
        enabled: false,
        coordinates: { x: 0, y: 0, z: 0, facing: "FrontRight" },
        object: { entity_id: "", anchor_ix: 0 },
        action: "walk"
      },
      commands: {
        enabled: true,
        list: {
          help: { enabled: true, message: 'This is the help command!', reply: 'public' },
          ping: { enabled: true, message: 'Pong!', reply: 'public' },
          uptime: { enabled: true, message: 'Uptime: {{uptime}}', reply: 'public' }
        }
      },
      message: 'Template by: @iHsein (Discord: ihsein)',
    };

    if (!options.settings.spawn) options.settings.spawn = { enabled: true, coordinates: { x: 0, y: 0, z: 0, facing: "FrontRight" }, object: { entity_id: "", anchor_ix: 0 }, action: "walk" };
    if (!options.settings.commands) options.settings.commands = { enabled: true, list: { help: { enabled: true, message: 'This is the help command!', reply: 'public' }, ping: { enabled: true, message: 'Pong!', reply: 'public' }, uptime: { enabled: true, message: 'Uptime: {{uptime}}', reply: 'public' } } };
    if (!options.settings.message) options.settings.message = 'Template by: @iHsein (Discord: ihsein)';
    if (!options.settings.prefix) options.settings.prefix = '!';
    if (!options.settings.spawn.enabled) options.settings.spawn.enabled = false;

    if (!options.joined.enabled) options.joined.enabled = true;
    if (!options.left.enabled) options.left.enabled = true;

    if (!options.joined.message) options.joined.message = '{{user}} has joined the room!';
    if (!options.left.message) options.left.message = '{{user}} has left the room!';

    if (!options.logs) options.logs = { welcome: true, goodbye: true, messages: false };
    if (!options.logs.welcome) options.logs.welcome = true;
    if (!options.logs.goodbye) options.logs.goodbye = true;

    if (typeof options.auth !== 'object') throw new Error('Invalid auth option');
    if (typeof options.auth.token !== 'string') throw new Error('Invalid token option');
    if (typeof options.auth.room_id !== 'string') throw new Error('Invalid room option');

    if (typeof options.settings !== 'object') throw new Error('Invalid settings option');
    if (typeof options.settings.prefix !== 'string') throw new Error('Invalid prefix option');
    if (typeof options.settings.spawn !== 'object') throw new Error('Invalid spawn option');
    if (typeof options.settings.spawn.coordinates !== 'object') throw new Error('Invalid coordinates option');
    if (typeof options.settings.spawn.object !== 'object') throw new Error('Invalid object option');
    if (typeof options.settings.spawn.action !== 'string') throw new Error('Invalid action option');
    if (!['walk', 'teleport', 'sit', 'teleport-walk', 'teleport-sit'].includes(options.settings.spawn.action)) throw new Error('Invalid action option');

    if (typeof options.joined !== 'object') throw new Error('Invalid joined option');
    if (typeof options.joined.enabled !== 'boolean') throw new Error('Invalid joined enabled option');
    if (typeof options.joined.message !== 'string') throw new Error('Invalid joined message');
    if (typeof options.joined.type !== 'string') throw new Error('Invalid joined type');
    if (!['whisper', 'public'].includes(options.joined.type)) throw new Error('Invalid joined type');

    if (typeof options.left !== 'object') throw new Error('Invalid left option');
    if (typeof options.left.enabled !== 'boolean') throw new Error('Invalid left enabled option');
    if (typeof options.left.message !== 'string') throw new Error('Invalid left message');

    if (typeof options.logs !== 'object') throw new Error('Invalid logs option');
    if (typeof options.logs.welcome !== 'boolean') throw new Error('Invalid welcome logs option');
    if (typeof options.logs.goodbye !== 'boolean') throw new Error('Invalid goodbye logs option');
    if (typeof options.logs.messages !== 'boolean') throw new Error('Invalid messages logs option');

    this.options = options;
    this.commands = new Collection();
    for (const [key, value] of Object.entries(this.options.settings.commands.list)) {
      if (value.enabled) {
        this.commands.set(key, value);
      }
    }

    this.bot = new Highrise({
      Events: [
        Events.Joins,
        Events.Leaves,
        Events.Messages
      ]
    });

    this.bot_id = this.bot.info.user.id;
    this.bot.on('chatCreate', (user, message) => {
      if (user.id === this.bot_id) return;
      if (this.options.logs.messages) {
        console.log(`[WelcomeBot] `.green + `${user.username} (${user.id}): ${message} (at ${new Date().toLocaleString()})`);
      }

      if (message.trim().toLowerCase().startsWith(this.options.settings.prefix)) {
        const args = message.trim().toLowerCase().slice(this.options.settings.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        if (this.commands.has(command)) {
          const cmd = this.commands.get(command);
          let message = cmd.message;
          message = message.replace(/{{user}}/g, user.username);
          message = message.replace(/{{uptime}}/g, this.bot.uptime());

          this.sendMessage(cmd.reply, message, user);
        }
      }
    });

    this.bot.on('ready', async () => {
      console.log(`[WelcomeBot] `.green + `The bot is up and running!\n\nTemplate by: @iHsein (Discord: ihsein)`);
      if (this.commands.size > 0) {
        this.commands.forEach((cmd, key) => {
          console.log(`[WelcomeBot] `.green + `Command: ${key} is enabled!`);
        });
      }

      if (!this.options.settings.spawn.enabled) return;

      const coords = this.options.settings.spawn.coordinates;
      const object = this.options.settings.spawn.object;
      const options = ['walk', 'teleport', 'sit', 'teleport-walk', 'teleport-sit'];

      switch (this.options.settings.spawn.action) {
        case "walk":
          this.bot.move.walk(coords.x, coords.y, coords.z, coords.facing);
          break;
        case "teleport":
          this.bot.player.teleport(this.bot_id, coords.x, coords.y, coords.z, coords.facing);
          break;
        case "sit":
          this.bot.move.sit(object.entity_id, object.anchor_ix);
          break;
        case "teleport-walk":
          this.bot.player.teleport(this.bot_id, coords.x, coords.y, coords.z, coords.facing);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          this.bot.move.walk(coords.x, coords.y, coords.z, coords.facing);
          break;
        case "teleport-sit":
          this.bot.player.teleport(this.bot_id, coords.x, coords.y, coords.z, coords.facing);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          this.bot.move.sit(object.entity_id, object.anchor_ix);
          break;
        default:
          console.error('[WelcomeBot] '.red + `Invalid action: ${this.options.settings.spawn.action}\n\nValid options: ${options.join(', ')}`);
          break;
      }

      this.bot.message.send(this.options.settings.message);
    });

    this.bot.on('playerJoin', (user) => {
      try {
        this.onJoin(user);
      } catch (e) {
        console.error('[WelcomeBot] '.red + 'Error: ' + e.message);
      }
    });

    this.bot.on('playerLeave', (user) => {
      try {
        this.onLeave(user);
      } catch (e) {
        console.error('[WelcomeBot] '.red + 'Error: ' + e.message);
      }
    });

    process.on('unhandledRejection', async (err, promise) => {
      console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
      console.error(promise);
    });

    this.bot.login(options.auth.token, options.auth.room_id);
  }

  onJoin(user) {
    if (this.options.logs.welcome) {
      console.log('[WelcomeBot] '.green + this.options.joined.message.replace('{{user}}', user.username) + ' (' + user.id + ')' + ' At ' + new Date().toLocaleString());
    }

    if (this.options.joined.enabled) {
      this.sendMessage(this.options.joined.type, this.options.joined.message.replace('{{user}}', user.username), user);
    }
  }

  onLeave(user) {
    if (this.options.logs.goodbye) {
      console.log('[WelcomeBot] '.green + this.options.left.message.replace('{{user}}', user.username) + ' (' + user.id + ')' + ' At ' + new Date().toLocaleString());
    }

    if (this.options.left.enabled) {
      this.bot.message.send(this.options.left.message.replace('{{user}}', user.username));
    }
  }

  sendMessage(type = "public", message, user = null) {
    switch (type) {
      case "whisper":
        this.bot.whisper.send(user.id, message);
        break;
      case "public":
        this.bot.message.send(message);
        break;
      default:
        console.error('[WelcomeBot] '.red + `Invalid type: ${type}\n\nValid options: whisper, public`);
        break;
    }
  }


}