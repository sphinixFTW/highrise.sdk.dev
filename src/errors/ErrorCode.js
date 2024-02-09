'use strict';

/**
 * @typedef {Object} HighrisejsErrorCodes
 * 
 * @property {WebSocketNotOpen} WebSocketNotOpen
 * @property {WebSocketAlreadyConnected} WebSocketAlreadyConnected
 * 
 * @property {FatalError} FatalError
 * @property {ClientInvalidOption} ClientInvalidOption
 * @property {ClientMissingEvents} ClientMissingEvents
 * @property {ClientNotReady} ClientNotReady
 * @property {ClientInvalidEvent} ClientInvalidEvent
 * @property {ClientMissingOptions} ClientMissingOptions
 * 
 * @property {TokenInvalid} TokenInvalid
 * @property {TokenMissing} TokenMissing
 * 
 * @property {RoomInvalid} RoomInvalid
 * @property {RoomNotFound} RoomNotFound
 * 
 * @property {WebApiTooManyRequests} WebApiTooManyRequests
 * @property {WebApiMissingParameters} WebApiMissingParameters
 * @property {WebApiInvalidParameters} WebApiInvalidParameters
 * @property {WebApiInvalidType} WebApiInvalidType
 * @property {WebApiUserNotFound} WebApiUserNotFound
 * @property {WebApiRoomNotFound} WebApiRoomNotFound
 * @property {WebApiUnknownError} WebApiUnknownError
 *
 * @property {AccessDenied} AccessDenied
 * @property {InvalidParameterType} InvalidParameterType
 * @property {MissingParameters} MissingParameters
 * 
 * @property {NoOptionsProvided} NoOptionsProvided
 * @property {EventNotEnabled} EventNotEnabled
 */


const keys = [
  'WebSocketNotOpen',
  'WebSocketAlreadyConnected',

  'FatalError',
  'ClientInvalidOption',
  'ClientMissingEvents',
  'ClientNotReady',
  'ClientInvalidEvent',
  'ClientMissingOptions',

  'TokenInvalid',
  'TokenMissing',

  'RoomInvalid',
  'RoomNotFound',

  'WebApiTooManyRequests',
  'WebApiMissingParameters',
  'WebApiInvalidParameters',
  'WebApiInvalidType',
  'WebApiUserNotFound',
  'WebApiRoomNotFound',
  'WebApiUnknownError',

  'AccessDenied',
  'MissingParameters',
  'InvalidParameterType',

  'NoOptionsProvided',
  'EventNotEnabled'
]

/**
 * @type {HighrisejsErrorCodes}
 * @ignore
 */

module.exports = Object.fromEntries(keys.map(key => [key, key]));