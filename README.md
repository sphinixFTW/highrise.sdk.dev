# **highrise.sdk.dev**
<p align="center">
  <img src="https://i.ibb.co/d0vtV49/highrise-logo.png" alt="highrise-logo" />
</p>

> **The Highrise SDK is a JavaScript library for writing and running Highrise bots.**

## **IMPORTANT**
This package is still in beta and is not yet ready for production use. Please use it with caution and report any issues or bugs you encounter.

## **⚙️ Installation** 
```
npm i highrise.sdk.dev@latest
```

## **✨ Features**

- Easy to use.
- Beginner friendly.
- Auto reconnect system.
- Supports Node version 10+
- Supports Highrise WebAPI

## **📥 Class Import**
1. Import the necessary classes and modules from the SDK:
```js
const { Highrise, Events, WebApi } = require('highrise.sdk.dev');
```

2. Set up the bot's settings by providing a bot token and room ID:
```js
const settings = {
  token: 'CHANGE-ME', // Replace with your bot token
  room: 'CHANGE-ME', // Replace with the room ID your bot will join
};
```

3. Create an instance of the Highrise bot, specifying the desired intents and cache option:
```js
// Create a new instance of the Highrise bot
const bot = new Highrise({
  Events: [
    Events.Joins, // Listen for user joins
    Events.Leaves, // Listen for user leaves
    Events.Messages // Listen for chat messages
    // Add more events here
  ],
  Cache: true, // Enable caching
  AutoFetchMessages: true // If you want to capture the incoming message in the messageCreate event.
});
```

3. Logging in the bot:
```js
bot.login(settings.token, settings.room); // Log in the bot
```

## **🎋 Events**
Events represents the different intents or event types that your bot can listen for. By specifying these intents when creating the bot, you can control which events your bot will receive. The available intents include:

- `Events.Messages`: Represents chat messages sent in the Highrise room.
- `Events.DirectMessages`: Represents direct messages sent to the bot.
- `Events.Joins`: Indicates when users join the room.
- `Events.Leaves`: Indicates when users leave the room.
- `Events.Reactions`: Represents reactions added to players.
- `Events.Emotes`: Represents emotes added to players.
- `Events.Tips`: Represents tip reactions received.
- `Events.VoiceChat`: Represents voice chat events.
- `Events.Movements`: Indicates when users move within the room.
- `Events.Error`: Represents errors that occur during API operations.
- `Events.Moderate`: Indicates when moderators perform moderation actions on players.

You can choose the intents based on the events you want your bot to handle.

## **📦 Cache Option**
The cache option, when set to true, enables caching of certain data to optimize performance and reduce API calls. By enabling the cache and using the appropriate intents, you can utilize methods that rely on cached data rather than making API requests.

## **📖 Examples**
- Listening for the ready event:
```js
bot.on('ready', (session) => {
  console.log("[i]".green + ` Bot is ready!`.green);
});
```
- Listening for chat messages:
```js
bot.on('chatCreate', async (user, message) => {
  console.log("[i]".green + ` ${user.username} sent a message: ${message}`.green);
});
```
- Listening for Direct Messages:
```js
// if AutoFetchMessages is set to true in the bot options you can capture the incoming message, otherwise you will need to fetch the message manually.
bot.on("messageCreate", async (user, data, message) => {
  console.log("[i]".green + ` ${user} sent a message: ${message}`.green);
});
```
- Listening for the join event:
```js
bot.on('playerJoin', (user, position) => {
  console.log("[i]".green + ` ${user.username} joined the room.`.green);
})
```

## **📘 Documentation**
Refer to the SDK documentation for more information on available events and methods.
[Highrise JS SDK Documentation](https://bit.ly/highrise-sdk)

## **🤝 Contributions**
Contributions to the Highrise SDK are welcome! If you find any issues or want to add new features, feel free to submit a pull request.

## Note

This package is not an official Highrise package, it's self-made by iHsein (sphinix) and is still in beta.

