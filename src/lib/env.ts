export const getEnv = () => {
  const {
    DISCORD_BOT_TOKEN,
    DISCORD_APP_ID,
    DISCORD_GUILD_ID,
    IMGUR_CLIENT_ID,
    IMGUR_CLIENT_SECRET,
  } = process.env;

  if (!DISCORD_BOT_TOKEN) {
    throw Error('Please set the environment variable DISCORD_BOT_TOKEN.');
  }
  if (!DISCORD_APP_ID) {
    throw Error('Please set the environment variable DISCORD_APP_ID.');
  }
  if (!DISCORD_GUILD_ID) {
    throw Error('Please set the environment variable DISCORD_GUILD_ID.');
  }
  if (!IMGUR_CLIENT_ID) {
    throw Error('Please set the environment variable IMGUR_CLIENT_ID.');
  }
  if (!IMGUR_CLIENT_SECRET) {
    throw Error('Please set the environment variable IMGUR_CLIENT_SECRET.');
  }

  return {
    discordBotToken: DISCORD_BOT_TOKEN,
    discordAppID: DISCORD_APP_ID,
    discordGuildID: DISCORD_GUILD_ID,
    imgurClientID: IMGUR_CLIENT_ID,
    imgurClientSecret: IMGUR_CLIENT_SECRET,
  };
};
