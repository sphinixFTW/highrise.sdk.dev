'user strict';

const ErrorCodes = require("./ErrorCode");
const Messages = require("./Messages");

function makeHighrisejsError(Base) {
  return class HighrisejsError extends Base {
    constructor(code, ...args) {
      super(message(code, args));
      this.code = code;
      Error.captureStackTrace?.(this, HighrisejsError);
    }

    get name() {
      return `${super.name} [${this.code}]`;
    }
  }
}

function message(code, args) {
  if (!(code in ErrorCodes)) throw new Error('An invalid error code was provided.');
  const msg = Messages[code];
  if (!msg) throw new Error(`An invalid error code was provided: ${code}.`);
  if (typeof msg === 'function') return msg(...args);
  if (!args?.length) return msg;
  args.unshift(msg);
  return String(...args);
}

module.exports = {
  HighrisejsError: makeHighrisejsError(Error),
  HighriseTypeError: makeHighrisejsError(TypeError),
  HighriseRangeError: makeHighrisejsError(RangeError),
}