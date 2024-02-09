const axios = require("axios");
const { packageVersion, packageName } = require("../utils/Package");
const { SessionMetadata, User, Position, AnchorPosition, CurrencyItem } = require("../utils/Models");

const handleReadyEvent = async (data, emit) => {
  const name = packageName();
  const response = await axios.get(`https://registry.npmjs.org/${name}`);
  const packageData = response.data;
  const latestVersion = packageData['dist-tags'].latest;

  const currentVersion = packageVersion();

  if (latestVersion !== currentVersion) {
    console.warn(`[WARNING]:`.red + ` You are using version ` + `${currentVersion}`.yellow + ` of highrise.sdk.dev. The latest version is ` + `${latestVersion}`.green + ` Consider updating by running ` + `npm install highrise.sdk.dev@latest`.green);
  }

  const session = new SessionMetadata(
    data.user_id,
    data.room_info,
    data.rate_limits,
    data.connection_id,
    currentVersion
  );

  if (session) {
    emit('ready', session);
  }

}

const handleChatEvent = (data, emit) => {
  const user = new User(data.user.id, data.user.username);
  const message = typeof data.message === 'string' ? data.message : data.message.text;

  if (data.whisper === false) {
    emit('chatCreate', user, message);
  } else {
    emit('whisperCreate', user, message);
  }
}

const handleDMEvent = async (data, emit, bot) => {
  const conversation = {
    id: data.conversation_id,
    isNew: data.is_new_conversation
  };

  if (bot.AutoFetchMessages) {
    const convo_id = conversation.id;
    const messages = await bot.inbox.messages.get(convo_id);
    const userMessages = messages.filter((message) => message.sender_id === data.user_id);
    const message = userMessages[0].content;

    emit('messageCreate', data.user_id, conversation, message);
  } else {
    emit('messageCreate', data.user_id, conversation);
  }
}

const handleUserJoinedEvent = (data, emit) => {
  const user = new User(data.user.id, data.user.username);
  const position = new Position(data.position.x, data.position.y, data.position.z, data.position.facing);
  emit('playerJoin', user, position);
}

const handleUserLeftEvent = (data, emit) => {
  const user = new User(data.user.id, data.user.username);
  emit('playerLeave', user);
}

const handleEmoteEvent = (data, emit) => {
  const sender = new User(data.user.id, data.user.username);
  const receiver = new User(data.receiver.id, data.receiver.username);
  const emoteId = data.emote_id;

  emit('playerEmote', sender, receiver, emoteId);
}

const handleReactEvent = (data, emit) => {
  const sender = new User(data.user.id, data.user.username);
  const receiver = new User(data.receiver.id, data.receiver.username);
  const reaction = data.reaction;

  emit('playerReact', sender, receiver, reaction);
}

const handleTipsEvent = (data, emit) => {
  const sender = new User(data.sender.id, data.sender.username);
  const receiver = new User(data.receiver.id, data.receiver.username);
  const item = new CurrencyItem(data.item.type, data.item.amount);

  emit('playerTip', sender, receiver, item);
}

const handleMovementEvent = (data, emit) => {
  const user = new User(data.user.id, data.user.username);
  if ('x' in data.position && 'y' in data.position && 'z' in data.position) {
    const destination = new Position(data.position.x, data.position.y, data.position.z, data.position.facing);
    emit('playerMove', user, destination);
  } else if ('entity_id' in data.position && 'anchor_ix' in data.position) {
    const anchor = new AnchorPosition(data.position.entity_id, data.position.anchor_ix);
    emit('playerMove', user, anchor);
  }
}

const handleVoiceEvent = (data, emit) => {
  const { users, seconds_left } = data;

  const formattedUsers = users.map(([userData, status]) => ({
    user: new User(userData.id, userData.username),
    status: status
  }));

  emit('voiceCreate', formattedUsers, seconds_left);
}

const handleErrorEvent = (data, emit, bot) => {
  if (bot.listenerCount('error') > 0) {
    emit('error', data.message);
  }
}

const handleRoomModerateEvent = (data, emit) => {
  const moderatorId = data.moderatorId;
  const targetUserId = data.targetUserId;
  const moderationType = data.moderationType;
  const duration = data.duration;

  emit('roomModerate', moderatorId, targetUserId, moderationType, duration);
}

function handleEvent(eventType, data) {
  try {

    const emit = this.emit.bind(this);
    switch (eventType) {
      case 'SessionMetadata':
        handleReadyEvent(data, emit);
        break;
      case 'ChatEvent':
        handleChatEvent(data, emit);
        break;
      case 'MessageEvent':
        handleDMEvent(data, emit, this);
        break;
      case 'UserJoinedEvent':
        handleUserJoinedEvent(data, emit);
        break;
      case 'UserLeftEvent':
        handleUserLeftEvent(data, emit);
        break;
      case 'EmoteEvent':
        handleEmoteEvent(data, emit);
        break;
      case 'ReactionEvent':
        handleReactEvent(data, emit);
        break;
      case 'TipReactionEvent':
        handleTipsEvent(data, emit);
        break;
      case 'UserMovedEvent':
        handleMovementEvent(data, emit);
        break;
      case 'VoiceEvent':
        handleVoiceEvent(data, emit);
        break;
      case 'Error':
        handleErrorEvent(data, emit, this);
        break;
      case 'RoomModeratedEvent':
        handleRoomModerateEvent(data, emit);
        break;
      default:
        console.warn("[i]".yellow + " Unknown event type: " + eventType + ". Please report this to @iHsein in the Highrise Discord server.");
    }

  } catch (error) {
    console.error("[!]".red + " Error while handling event: " + error + ". Please report this to @iHsein in the Highrise Discord server.");
  }
}

module.exports = { handleEvent, handleReadyEvent };