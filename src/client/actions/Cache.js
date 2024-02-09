const Collection = require("../../utils/Collection");
const { ErrorCodes, HighriseTypeError } = require("../../errors");

class Cache {
  constructor(bot) {
    this.bot = bot;
    this.collection = new Collection();
    this.cache = bot.Cache || false;
    this.events = bot.Events || [];
  }

  async FetchUserCollection() {
    try {

      const users = await this.bot.room.players.get();
      for (const [userObj, positionObj] of users) {
        const userData = {
          id: userObj.id,
          username: userObj.username,
          position: positionObj
        };

        this.collection.set(userData.id, userData);
      }

      console.log('[i]'.green, `Fetched ${this.collection.size} users from room and cached them.`);

    } catch (error) {
      throw error;
    }
  }

  addUserToCollection(user_id, userData) {
    const collection = this.collection.get(user_id);
    if (collection) return;

    this.collection.set(user_id, userData);
  }

  removeUserFromCollection(user_id) {
    const collection = this.collection.get(user_id);
    if (!collection) return;

    this.collection.delete(user_id);
  }

  updateUserPosition(user_id, position) {
    const collection = this.collection.get(user_id);
    if (!collection) return;

    collection.position = position;
  }

  get() {
    const collection = [...this.collection.values()];
    const result = collection.map(user => [{ id: user.id, username: user.username }, user.position]);
    return result;
  }

  id(username) {
    try {

      if (!username) throw new HighriseTypeError(ErrorCodes.MissingParameters, "username");
      if (typeof username !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, "username", "string");

      const collection = [...this.collection.values()].find(user => user.username?.toLowerCase() === username.toLowerCase());
      if (!collection) return null;

      return collection.id;
    } catch (error) {
      throw error;
    }
  }

  username(user_id) {
    try {

      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, "user_id");
      if (typeof user_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, "user_id", "string");

      const collection = [...this.collection.values()].find(user => user.id === user_id);
      if (!collection) return null;

      return collection.username;
    } catch (error) {
      throw error;
    }
  }

  position(user_id) {
    try {

      if (!user_id) throw new HighriseTypeError(ErrorCodes.MissingParameters, "user_id");
      if (typeof user_id !== 'string') throw new HighriseTypeError(ErrorCodes.InvalidParameterType, "user_id", "string");

      const collection = [...this.collection.values()].find(user => user.id === user_id);
      if (!collection) return null;

      return collection.position;

    } catch (error) {
      throw error;
    }
  }

  size() {
    return this.collection.size;
  }

  clear() {
    this.collection.clear();
  }

  filter(fn) {
    return this.collection.filter(fn);
  }

  find(fn) {
    return this.collection.find(fn);
  }

  map(fn) {
    return this.collection.map(fn);
  }

}

module.exports = Cache;