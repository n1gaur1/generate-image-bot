export const getEnv = () => {
  const {
    DISCORD_BOT_TOKEN,
    DISCORD_APP_ID,
    DISCORD_GUILD_ID,
    IMGUR_CLIENT_ID,
    IMGUR_CLIENT_SECRET,
    IMGUR_ACCESS_TOKEN,
    IMGUR_REFRESH_TOKEN,

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
  if (!IMGUR_ACCESS_TOKEN) {
    throw Error('Please set the environment variable IMGUR_ACCESS_TOKEN.');
  }
  if (!IMGUR_REFRESH_TOKEN) {
    throw Error('Please set the environment variable IMGUR_REFRESH_TOKEN.');
  }

  return {
    discordBotToken: DISCORD_BOT_TOKEN,
    discordAppID: DISCORD_APP_ID,
    discordGuildID: DISCORD_GUILD_ID,
    imgurClientID: IMGUR_CLIENT_ID,
    imgurClientSecret: IMGUR_CLIENT_SECRET,
    imgurAccessToken: IMGUR_ACCESS_TOKEN,
    imgurRefreshToken: IMGUR_REFRESH_TOKEN,
  };
};
