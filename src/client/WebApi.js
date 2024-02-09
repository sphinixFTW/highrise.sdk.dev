'use strict';
const axios = require("axios");
const { HighriseTypeError, ErrorCodes, HighrisejsError } = require("../errors");

class WebApi {
  constructor() {
    this.endpoint = "https://webapi.highrise.game/";
    this.sort_order = ['asc', 'desc']
  }

  /**
  * Retrieve the profile of a user.
  *
  * @param {string} user_id - The user's ID.
  * @returns {Object} The user's profile.
  * 
  * @example
  * const { WebApi } = require("highrise.sdk.dev");
  * WebApi.getUserById("55bb64735531104341039ca8").then(user => console.log(user));
  */
  async getUserById(user_id) {

    if (!user_id) {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'user_id', 'string');
    }

    if (typeof user_id !== "string") {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'user_id', 'string');
    }

    try {
      const response = await axios.get(`${this.endpoint}/users/${user_id}`);

      const { status } = response;


      if (status !== 200) {
        if (status === 429) {
          throw new HighriseTypeError(ErrorCodes.WebApiTooManyRequests);
        } else {
          throw new HighriseTypeError(ErrorCodes.WebApiUnknownError, status);
        }
      }

      return response.data?.user;

    } catch (e) {
      console.error(`[getUserById] Error: ${e.response.data}`);
    }
  }

  /**
   * Retrieve the profile of a user.
   * @param {string} username - The user's username.
   * @returns {Object} The user's profile.
   *  
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * WebApi.getUserByName("iHsein").then(user => console.log(user));
   * 
  */
  async getUserByName(username) {
    if (!username) {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'username', 'string');
    }

    if (typeof username !== "string") {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'username', 'string');
    }

    try {

      const user = await this.getUsers(username, 1);
      if (!user) {
        throw new HighriseTypeError(ErrorCodes.WebApiUserNotFound, username);
      }

      return user;

    } catch (e) {
      console.error(`[getUserByName] Error: ${e.response.data}`);
    }
  }

  /**
  * Retrieves users from the API based on the specified parameters.
  *
  * @param {string|null} username - The username to filter the users by.
  * @param {number} limit - The maximum number of users to retrieve.
  * @param {string|null} starts_after - The user ID to start retrieving users after.
  * @param {string|null} ends_before - The user ID to end retrieving users before.
  * @param {string} sort_order - The sort order for the retrieved users.
  * @returns {Promise<object|null>} - A promise that resolves with the retrieved users or null.
  * 
  * @example
  * const { WebApi } = require("highrise.sdk.dev");
  * // Retrieve the user with the username "iHsein".
  * WebApi.getUsers("iHsein", 1).then(users => console.log(users));
  * 
  * // Retrieve the first user that starts after the user with the ID "55bb64735531104341039ca8".
  * WebApi.getUsers(null, 1, "55bb64735531104341039ca8").then(users => console.log(users));
  * 
  * // Retrieve the first user that ends before the user with the ID "55bb64735531104341039ca8".
  * WebApi.getUsers(null, 1, null, "55bb64735531104341039ca8").then(users => console.log(users));
  * 
  * // Retrieve all the users in descending order.
  * WebApi.getUsers(null, 1, null, null, "desc").then(users => console.log(users));
  * 
  * // Retrieve the first 100 users.
  * WebApi.getUsers(null, 100).then(users => console.log(users));
  */

  async getUsers(username = null, limit = 100, starts_after = null, ends_before = null, sort_order = 'asc') {
    let endpoint = `${this.endpoint}users?`;

    if (username) {
      if (typeof username !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'username', 'string');
      }

      endpoint += `&username=${username}`;
    }

    if (limit) {
      if (isNaN(limit) || typeof limit !== "number" || limit > 100 || limit < 1) {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'limit', 'number');
      }

      endpoint += `&limit=${limit}`;
    }

    if (sort_order) {
      if (!this.sort_order.includes(sort_order)) {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'sort_order', 'string');
      }

      endpoint += `&sort_order=${sort_order}`;
    }

    if (starts_after) {
      if (typeof starts_after !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'starts_after', 'string');
      }
      endpoint += `&starts_after=${starts_after}`;
    }

    if (ends_before) {
      if (typeof ends_before !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'ends_before', 'string');
      }
      endpoint += `&ends_before=${ends_before}`;
    }

    try {

      const response = await axios.get(endpoint);
      if (response.status !== 200) {
        if (response.status === 429) {
          throw new HighriseTypeError(ErrorCodes.WebApiTooManyRequests);
        } else {
          throw new HighriseTypeError(ErrorCodes.WebApiUnknownError, response.status);
        }
      }

      return response.data?.total > 1 ? response.data : response.data.users[0];

    } catch (e) {
      console.error(`[getUsers] Error: ${e.response.data}`);
    }
  }

  /**
   * Retrieves the profile of a room.
   * @param {string} room_id - The room's ID.
   * @returns {Object} The room's profile.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * WebApi.getRoomById("6522ad66f96c4009eb55d5a7").then(room => console.log(room));
  **/
  async getRoomById(room_id) {
    if (!room_id) {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'room_id', 'string')
    }

    if (typeof room_id !== "string") {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'room_id', 'string')
    }

    try {

      const response = await axios.get(`${this.endpoint}/rooms/${room_id}`);
      if (response.status !== 200) {
        if (response.status === 429) {
          throw new HighriseTypeError(ErrorCodes.WebApiTooManyRequests);
        } else {
          throw new HighriseTypeError(ErrorCodes.WebApiUnknownError, response.status);
        }
      }

      return response.data?.room;

    } catch (e) {
      console.error(`[getRoomById] Error: ${e.response.data}`);
    }
  }

  /**
   * Retrieves the profile of a room.
   * @param {string} owner_id - The owner's ID.
   * @param {string} room_name - The room's name.
   * @returns {Object} The room's profile.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * WebApi.getRoomByName("55bb64735531104341039ca8", "iHsein's Room").then(room => console.log(room));
  **/

  async getRoomByName(owner_id, room_name) {

    if (!owner_id) {
      throw new HighrisejsError(ErrorCodes.WebApiMissingParameters, 'owner_id', 'string');
    }

    if (typeof owner_id !== "string") {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'owner_id', 'string');
    }

    if (!room_name) {
      throw new HighriseTypeError(ErrorCodes.WebApiMissingParameters, 'room_name', 'string');
    }

    if (typeof room_name !== "string") {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'room_name', 'string');
    }

    try {

      const response = await this.getRooms(owner_id, 100);
      if (!response) {
        throw new HighriseTypeError(ErrorCodes.WebApiRoomNotFound, room_name)
      }

      const room = response.find(room => room.disp_name === room_name);
      if (!room) {
        throw new HighriseTypeError(ErrorCodes.WebApiRoomNotFound, room_name)
      }

      return room;

    } catch (e) {
      console.error(`[getRoomByName] Error: ${e.message}`);
    }
  }
  /**
   * Retrieves the profile of a room.
   * @param {string} owner_id - The owner's ID.
   * @param {number} limit - The maximum number of rooms to retrieve.
   * @param {string|null} starts_after - The room ID to start retrieving rooms after.
   * @param {string|null} ends_before - The room ID to end retrieving rooms before.
   * @param {string} sort_order - The sort order for the retrieved rooms.
   * @returns {Promise<object|null>} - A promise that resolves with the retrieved rooms or null.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * // Retrieve the room with the owner ID "55bb64735531104341039ca8".
   * WebApi.getRooms("55bb64735531104341039ca8", 1).then(rooms => console.log(rooms));
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
   * // Retrieve the first 20 rooms for the user with the ID "55bb64735531104341039ca8".
   * WebApi.getRooms("55bb64735531104341039ca8", 20).then(rooms => console.log(rooms));
  **/
  async getRooms(owner_id, limit = 100, starts_after = null, ends_before = null, sort_order = 'asc') {

    let endpoint = `${this.endpoint}rooms?`;

    if (owner_id) {
      if (typeof owner_id !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'owner_id', 'string');
      }

      endpoint += `&owner_id=${owner_id}`;
    }

    if (limit) {
      if (isNaN(limit) || typeof limit !== "number" || limit > 100 || limit < 1) {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'limit', 'number');
      }

      endpoint += `&limit=${limit}`;
    }

    if (sort_order) {
      if (!this.sort_order.includes(sort_order)) {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'sort_order', 'string');
      }

      endpoint += `&sort_order=${sort_order}`;
    }

    if (starts_after) {
      if (typeof starts_after !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'starts_after', 'string');
      }

      endpoint += `&starts_after=${starts_after}`;
    }

    if (ends_before) {
      if (typeof ends_before !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'ends_before', 'string');
      }

      endpoint += `&ends_before=${ends_before}`;
    }

    try {

      const response = await axios.get(endpoint);
      if (response.status !== 200) {
        if (response.status === 429) {
          throw new HighriseTypeError(ErrorCodes.WebApiTooManyRequests);
        } else {
          throw new HighriseTypeError(ErrorCodes.WebApiUnknownError, response.status);
        }
      }

      return response.data.rooms;

    } catch (e) {
      console.error(`[getRooms] Error: ${e.response.data}`);
    }
  }

  /**
   * Retrieves the profile of a post.
   * @param {string} post_id - The post's ID.
   * @returns {Object} The post's profile.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * WebApi.getPostById("65134fe40b9cf4e4026aa5b4").then(post => console.log(post));
   * 
  */
  async getPostById(post_id) {

    if (!post_id) {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'post_id', 'string');
    }

    if (typeof post_id !== "string") {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'post_id', 'string');
    }

    try {

      const response = await axios.get(`${this.endpoint}/posts/${post_id}`);
      if (response.status !== 200) {
        if (response.status === 429) {
          throw new HighriseTypeError(ErrorCodes.WebApiTooManyRequests);
        } else {
          throw new HighriseTypeError(ErrorCodes.WebApiUnknownError, response.status);
        }
      }

      return response.data?.post;

    } catch (error) {
      console.error(`[getPostById] Error: ${error.response.data}`);
    }
  }

  /**
    * Retrieves user posts
   * @param {string} author_id - The author's ID.
   * @param {number} limit - The maximum number of posts to retrieve.
   * @param {string|null} starts_after - The post ID to start retrieving posts after.
   * @param {string|null} ends_before - The post ID to end retrieving posts before.
   * @param {string} sort_order - The sort order for the retrieved posts.
   * @returns {Promise<object|null>} - A promise that resolves with the retrieved posts or null.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * // Retrieve the post with the author ID "55bb64735531104341039ca8".
   * WebApi.getPosts("55bb64735531104341039ca8", 1).then(posts => console.log(posts));
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

  async getPosts(author_id, limit = 100, starts_after = null, ends_before = null, sort_order = 'asc') {
    if (!author_id) {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'author_id', 'string');
    }

    if (typeof author_id !== "string") {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'author_id', 'string');
    }

    let endpoint = `${this.endpoint}posts?&author_id=${author_id}`;

    if (limit) {
      if (isNaN(limit) || typeof limit !== "number" || limit > 100 || limit < 1) {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'limit', 'number');
      }

      endpoint += `&limit=${limit}`;
    }

    if (sort_order) {
      if (!this.sort_order.includes(sort_order)) {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'sort_order', 'string');
      }

      endpoint += `&sort_order=${sort_order}`;
    }

    if (starts_after) {
      if (typeof starts_after !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'starts_after', 'string');
      }

      endpoint += `&starts_after=${starts_after}`;
    }

    if (ends_before) {
      if (typeof ends_before !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'ends_before', 'string');
      }

      endpoint += `&ends_before=${ends_before}`;
    }

    try {

      const response = await axios.get(endpoint);
      if (response.status !== 200) {
        if (response.status === 429) {
          throw new HighriseTypeError(ErrorCodes.WebApiTooManyRequests);
        } else {
          throw new HighriseTypeError(ErrorCodes.WebApiUnknownError, response.status);
        }
      }

      return response.data.posts;

    } catch (error) {
      console.error(`[getPosts] Error: ${error.response.data}`);
    }
  }

  /**
   * Retrieves the profile of a grab.
   * @param {string} grab_id - The grab's ID.
   * @returns {Object} The grab's profile.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * WebApi.getGrab("655270f3712573254c14a8a5").then(grab => console.log(grab));
  */
  async getGrab(grab_id) {

    if (!grab_id) {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'grab_id', 'string')
    }

    if (typeof grab_id !== "string") {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'grab_id', 'string')
    }

    try {

      const response = await axios.get(`${this.endpoint}/grabs/${grab_id}`);
      if (response.status !== 200) {
        if (response.status === 429) {
          throw new HighriseTypeError(ErrorCodes.WebApiTooManyRequests);
        } else {
          throw new HighriseTypeError(ErrorCodes.WebApiUnknownError, response.status);
        }
      }

      return response.data?.grab;

    } catch (error) {
      console.error(`[getGrab] Error: ${error.response.data}`);
    }
  }

  /**
   * Retrieves game grabs
   * @param {number} limit - The maximum number of grabs to retrieve.
   * @param {string|null} title - The grab title to filter the grabs by.
   * @param {string|null} starts_after - The grab ID to start retrieving grabs after.
   * @param {string|null} ends_before - The grab ID to end retrieving grabs before.
   * @param {string} sort_order - The sort order for the retrieved grabs.
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
  async getGrabs(limit = 100, title = null, starts_after = null, ends_before = null, sort_order = 'asc') {

    let endpoint = `${this.endpoint}grabs?`;

    if (limit) {
      if (isNaN(limit) || typeof limit !== "number" || limit > 100 || limit < 1) {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'limit', 'number');
      }

      endpoint += `&limit=${limit}`;
    }

    if (title) {
      if (typeof title !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'title', 'string');
      }

      endpoint += `&title=${title}`;
    }

    if (sort_order) {
      if (!this.sort_order.includes(sort_order)) {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'sort_order', 'string');
      }

      endpoint += `&sort_order=${sort_order}`;
    }

    if (starts_after) {
      if (typeof starts_after !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'starts_after', 'string');
      }

      endpoint += `&starts_after=${starts_after}`;
    }

    if (ends_before) {
      if (typeof ends_before !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'ends_before', 'string');
      }

      endpoint += `&ends_before=${ends_before}`;
    }

    try {

      const response = await axios.get(endpoint);
      if (response.status !== 200) {
        if (response.status === 429) {
          throw new HighriseTypeError(ErrorCodes.WebApiTooManyRequests);
        } else {
          throw new HighriseTypeError(ErrorCodes.WebApiUnknownError, response.status);
        }
      }

      return response.data.grabs;

    } catch (error) {
      console.error(`[getGrabs] Error: ${error.response.data}`);
    }
  }

  /**
   * Retrieves the profile of an item.
   * @param {string} item_id - The item's ID.
   * @returns {Object} The item's profile.
   * 
   * @example
   * const { WebApi } = require("highrise.sdk.dev");
   * WebApi.getItemById("watch-n_techcrewrewards2019fitnesstracker").then(item => console.log(item));
  */
  async getItemById(item_id) {

    if (!item_id) {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'item_id', 'string');
    }

    if (typeof item_id !== "string") {
      throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'item_id', 'string');
    }

    try {

      const response = await axios.get(`${this.endpoint}/items/${item_id}`);
      if (response.status !== 200) {
        if (response.status === 429) {
          throw new HighriseTypeError(ErrorCodes.WebApiTooManyRequests);
        } else {
          throw new HighriseTypeError(ErrorCodes.WebApiUnknownError, response.status);
        }
      }

      return response.data?.item;

    } catch (error) {
      console.error(`[getItemById] Error: ${error.response.data}`);
    }
  }

  async getItems(limit = 100, category = null, rarity = null, item_name = null, starts_after = null, ends_before = null, sort_order = 'asc') {
    let endpoint = `${this.endpoint}items?`;

    if (limit) {
      if (isNaN(limit) || typeof limit !== "number" || limit > 100 || limit < 1) {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'limit', 'number');
      }

      endpoint += `&limit=${limit}`;
    }

    if (category) {
      if (typeof category !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'category', 'string');
      }

      endpoint += `&category=${category}`;
    }

    if (rarity) {
      if (typeof rarity !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'rarity', 'string');
      }

      endpoint += `&rarity=${rarity}`;
    }

    if (item_name) {
      if (typeof item_name !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'item_name', 'string')
      }

      endpoint += `&item_name=${item_name}`;
    }

    if (sort_order) {
      if (!this.sort_order.includes(sort_order)) {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'sort_order', 'string');
      }

      endpoint += `&sort_order=${sort_order}`;
    }

    if (starts_after) {
      if (typeof starts_after !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'starts_after', 'string');
      }

      endpoint += `&starts_after=${starts_after}`;
    }

    if (ends_before) {
      if (typeof ends_before !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'ends_before', 'string');
      }

      endpoint += `&ends_before=${ends_before}`;
    }

    try {

      const response = await axios.get(endpoint);
      if (response.status !== 200) {
        if (response.status === 429) {
          throw new HighriseTypeError(ErrorCodes.WebApiTooManyRequests);
        } else {
          throw new HighriseTypeError(ErrorCodes.WebApiUnknownError, response.status);
        }
      }

      return response.data.items;

    } catch (error) {
      console.error(`[getItems] Error: ${error.response.data}`);
    }
  }

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
  async searchItem(limit = 100, skip = 0, query = null) {
    let endpoint = `${this.endpoint}items/search?`;

    if (limit) {
      if (isNaN(limit) || typeof limit !== "number" || limit > 100 || limit < 1) {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'limit', 'number');
      }

      endpoint += `&limit=${limit}`;
    }

    if (skip) {
      if (isNaN(skip) || typeof skip !== "number") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidParameters, 'skip', 'number');
      }

      endpoint += `&skip=${skip}`;
    }

    if (query) {
      if (typeof query !== "string") {
        throw new HighriseTypeError(ErrorCodes.WebApiInvalidType, 'query', 'string');
      }

      endpoint += `&query=${query}`;
    }

    try {

      const response = await axios.get(endpoint);
      if (response.status !== 200) {
        if (response.status === 429) {
          throw new HighriseTypeError(ErrorCodes.WebApiTooManyRequests);
        } else {
          throw new HighriseTypeError(ErrorCodes.WebApiUnknownError, response.status);
        }
      }

      return response.data.items;

    } catch (error) {
      console.error(`[searchItem] Error: ${error.response.data}`);
    }
  }
}

module.exports = WebApi;
