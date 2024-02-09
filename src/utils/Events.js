const Events = {
  Ready: 'SessionMetadata',
  Error: 'Error',
  Messages: 'ChatEvent',
  DirectMessages: 'MessageEvent',
  Joins: 'UserJoinedEvent',
  Leaves: 'UserLeftEvent',
  Reactions: 'ReactionEvent',
  Emotes: 'EmoteEvent',
  Tips: 'TipReactionEvent',
  VoiceChat: 'VoiceEvent',
  Movements: 'UserMovedEvent',
  Moderate: 'RoomModeratedEvent',
  Channel: 'ChannelEvent',
};

const WebSocketEventType = {
  SessionMetadata: [Events.Ready],
  Error: [Events.Error],
  ChatEvent: [Events.Messages],
  MessageEvent: [Events.DirectMessages],
  UserJoinedEvent: [Events.Joins],
  UserLeftEvent: [Events.Leaves],
  ReactionEvent: [Events.Reactions],
  EmoteEvent: [Events.Emotes],
  TipReactionEvent: [Events.Tips],
  VoiceEvent: [Events.VoiceChat],
  UserMovedEvent: [Events.Movements],
  RoomModeratedEvent: [Events.Moderate],
  ChannelEvent: [Events.Channel]
};

const WebSocketEventParameters = {
  [Events.Messages]: 'chat',
  [Events.Joins]: 'user_joined',
  [Events.Leaves]: 'user_left',
  [Events.Reactions]: 'reaction',
  [Events.Emotes]: 'emote',
  [Events.Tips]: 'tip_reaction',
  [Events.VoiceChat]: 'voice',
  [Events.Movements]: 'user_moved',
  [Events.Moderate]: 'moderation',
  [Events.DirectMessages]: 'message',
  [Events.Channel]: 'channel',

};

module.exports = {
  Events,
  WebSocketEventType,
  WebSocketEventParameters
};