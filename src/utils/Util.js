const packageVersion = () => {
  const packagePath = require("../../package.json");
  const version = packagePath.version;

  return version;
}

const packageAuthor = () => {
  const packagePath = require("../../package.json");
  const author = packagePath.author;

  return author;
}

const packageName = () => {
  const packagePath = require("../../package.json");
  const name = packagePath.name;

  return name;
}

const generateRid = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;
  let rid = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    rid += characters.charAt(randomIndex);
  }
  return rid;
}

const getUptime = () => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
  const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  return `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
}

const Facing = {
  FrontRight: 'FrontRight',
  FrontLeft: 'FrontLeft',
  BackRight: 'BackRight',
  BackLeft: 'BackLeft'
}

const GoldBars = {
  BAR_1: 1,
  BAR_5: 5,
  BAR_10: 10,
  BAR_50: 50,
  BAR_100: 100,
  BAR_500: 500,
  BAR_1000: 1000,
  BAR_5000: 5000,
  BAR_10000: 10000,
}

const Reactions = {
  Heart: 'heart',
  Wink: 'wink',
  Thumbs: 'thumbs',
  Wave: 'wave',
  Clap: 'clap',
}

const Prioreties = {
  BotWalletOnly: 'bot_wallet_only',
  BotWalletAndUser: 'bot_wallet_priority',
  UserWalletOnly: 'user_wallet_only'
}

const BodyParts = {
  Hair: 'hair',
  Hair_Front: 'hair_front',
  Hair_Back: 'hair_back',
  Eyes: 'eye',
  Eyebrow: 'eyebrow',
  Lips: 'mouth',
  Skin: 'body'
}

const colorsIndexMinAndMax = {
  "hair": {
    min: 0,
    max: 81
  },
  "hair_front": {
    min: 0,
    max: 81
  },
  "hair_back": {
    min: 0,
    max: 81
  },
  "eye": {
    min: 0,
    max: 49
  },
  "eyebrow": {
    min: 0,
    max: 81
  },
  "mouth": {
    min: -1,
    max: 57
  },
  "body": {
    min: 0,
    max: 86
  }
}

module.exports = {
  packageVersion,
  packageAuthor,
  generateRid,
  packageName,
  getUptime,
  Facing,
  GoldBars,
  Reactions,
  Prioreties,
  BodyParts,
  colorsIndexMinAndMax
}