'use strict';
const Emotes = require("../Emotes");

module.exports = class DanceFloor {
  constructor(bot, options = {}) {
    if (!bot) throw new Error('No bot provided');

    if (!options.duration) options.duration = 10000;
    if (!options.enabled) options.enabled = false;
    if (!options.emotes) options.emotes = Emotes;
    if (!options.groupSize) options.groupSize = 5;
    if (!options.delay) options.delay = 5000;

    if (!options.parameter) throw new Error('No parameter provided');
    if (options.parameter.minX === undefined) throw new Error('No minX provided');
    if (options.parameter.minY === undefined) throw new Error('No minY provided');
    if (options.parameter.minZ === undefined) throw new Error('No minZ provided');
    if (options.parameter.maxX === undefined) throw new Error('No maxX provided');
    if (options.parameter.maxY === undefined) throw new Error('No maxY provided');
    if (options.parameter.maxZ === undefined) throw new Error('No maxZ provided');

    if (typeof options.duration !== 'number') throw new Error('Invalid duration option');
    if (typeof options.enabled !== 'boolean') throw new Error('Invalid enabled option');
    if (typeof options.emotes !== 'object') throw new Error('Invalid emotes option');
    if (typeof options.groupSize !== 'number') throw new Error('Invalid groupSize option');
    if (options.duration && (options.duration < 0)) throw new Error('Invalid duration option');
    if (options.emotes && (options.emotes.length < 1)) throw new Error('Invalid emotes option');

    if (typeof options.parameter !== 'object') throw new Error('Invalid parameter option');
    if (typeof options.parameter.minX !== 'number') throw new Error('Invalid minX option');
    if (typeof options.parameter.minY !== 'number') throw new Error('Invalid minY option');
    if (typeof options.parameter.minZ !== 'number') throw new Error('Invalid minZ option');
    if (typeof options.parameter.maxX !== 'number') throw new Error('Invalid maxX option');
    if (typeof options.parameter.maxY !== 'number') throw new Error('Invalid maxY option');
    if (typeof options.parameter.maxZ !== 'number') throw new Error('Invalid maxZ option');

    this.bot = bot;
    this.options = options;
    this.emotes = options.emotes ? options.emotes : options.emotes.map(emote => emote.id);
    setInterval(async () => {
      if (this.options.enabled) await this.create();
    }, options.duration);
  }

  async create() {
    try {
      const players = await this.fetchPlayers();
      const groups = this.splitIntoGroups(players, this.options.groupSize);

      const promises = groups.map((group, index) => {
        return new Promise((resolve) => {
          const delay = (index + 1) * this.options.delay;
          const randomEmote = this.emotes[Math.floor(Math.random() * this.emotes.length)];
          setTimeout(async () => {
            const emotePromises = group.map(async player => {
              const position = player[1];
              if (this.isInArea(position)) {
                try {
                  await this.bot.player.emote(player[0].id, randomEmote);
                } catch (e) {
                  console.error("Error emote player", e.message);
                }
              }
            });

            await Promise.all(emotePromises);
            resolve();
          }, delay);
        });
      });

      Promise.all(promises)
        .then(() => console.log("[i]".green + " Dance floor created with " + players.length + " players!"))
        .catch(e => console.error("Error creating dance floor", e));

    } catch (error) {
      console.error("Error creating dance floor", error);
    }
  }

  async fetchPlayers() {
    try {

      const players = await this.bot.room.players.get();
      return players;

    } catch (e) {
      console.error("Error fetching players", e);
    }
  }

  isInArea(position) {
    const minX = this.options.parameter.minX;
    const minY = this.options.parameter.minY;

    const minZ = this.options.parameter.minZ;
    const maxX = this.options.parameter.maxX;

    const maxY = this.options.parameter.maxY;
    const maxZ = this.options.parameter.maxZ;

    const { x, y, z } = position;
    return x >= minX && x <= maxX && y >= minY && y <= maxY && z >= minZ && z <= maxZ;
  }

  splitIntoGroups(array, groupSize) {
    const groups = [];
    for (let i = 0; i < array.length; i += groupSize) {
      groups.push(array.slice(i, i + groupSize));
    }

    return groups;
  }
}