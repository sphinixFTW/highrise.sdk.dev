'use strict';

const HRJSErrorCodes = require("./ErrorCode");
const Messages = {
  // General
  [HRJSErrorCodes.UNKNOWN_ERROR]: "Unknown error",

  // WebSocket
  [HRJSErrorCodes.WebSocketNotOpen]: "WebSocket is not open",
  [HRJSErrorCodes.WebSocketAlreadyConnected]: "WebSocket is already connected",

  // Client
  [HRJSErrorCodes.FatalError]: (error) => error,
  [HRJSErrorCodes.ClientMissingEvents]: "The client is missing events",
  [HRJSErrorCodes.ClientInvalidEvent]: "The client provided an invalid event",
  [HRJSErrorCodes.ClientInvalidOption]: (prop, must) => `The ${prop} option must be ${must}`,
  [HRJSErrorCodes.ClientNotReady]: action => `The client needs to be logged in to ${action}`,
  [HRJSErrorCodes.ClientMissingOptions]: (prop) => `The ${prop} option is required`,

  // Token
  [HRJSErrorCodes.TokenInvalid]: "An invalid token was provided",
  [HRJSErrorCodes.TokenMissing]: 'Request to use token, but token was unavailable to the client.',

  // Room
  [HRJSErrorCodes.RoomInvalid]: "An invalid room was provided",
  [HRJSErrorCodes.RoomNotFound]: "The provided room was not found",

  // WebApi
  [HRJSErrorCodes.WebApiTooManyRequests]: "Too many requests were made to the web api",
  [HRJSErrorCodes.WebApiMissingParameters]: "Missing parameters were provided to the web api",
  [HRJSErrorCodes.WebApiInvalidParameters]: (prop, must) => `The ${prop} parameter must be ${must}`,
  [HRJSErrorCodes.WebApiInvalidType]: (prop, must) => `The ${prop} parameter must be ${must}`,
  [HRJSErrorCodes.WebApiUserNotFound]: "The provided user was not found in the web api",
  [HRJSErrorCodes.WebApiRoomNotFound]: "The provided room was not found in the web api",
  [HRJSErrorCodes.WebApiUnknownError]: (error) => `An unknown error occured in the web api: ${error}`,

  [HRJSErrorCodes.AccessDenied]: (prop, must) => `Access denied: You cannot perform this action on the bot, change the ${prop} option to ${must} to perform this action`,
  [HRJSErrorCodes.MissingParameters]: (prop) => `The ${prop} parameter is required`,
  [HRJSErrorCodes.InvalidParameterType]: (prop, must) => `The ${prop} parameter must be ${must}`,

  [HRJSErrorCodes.NoOptionsProvided]: "No options were provided",
  [HRJSErrorCodes.EventNotEnabled]: (event) => `The ${event} event is not enabled`
}

module.exports = Messages;