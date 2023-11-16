export const getEnv = () => {
  const {
    DISCORD_BOT_TOKEN,
    DISCORD_APP_ID,
    DISCORD_GUILD_ID,
    DROPBOX_ACCESS_TOKEN,
    DROPBOX_REFRESH_TOKEN,
    DROPBOX_APP_KEY,
    DROPBOX_APP_SECRET,
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
  if (!DROPBOX_ACCESS_TOKEN) {
    throw Error('Please set the environment variable DROPBOX_ACCESS_TOKEN.');
  }
  if (!DROPBOX_REFRESH_TOKEN) {
    throw Error('Please set the environment variable DROPBOX_REFRESH_TOKEN.');
  }
  if (!DROPBOX_APP_KEY) {
    throw Error('Please set the environment variable DROPBOX_APP_KEY.');
  }
  if (!DROPBOX_APP_SECRET) {
    throw Error('Please set the environment variable DROPBOX_APP_SECRET.');
  }

  return {
    discordBotToken: DISCORD_BOT_TOKEN,
    discordAppID: DISCORD_APP_ID,
    discordGuildID: DISCORD_GUILD_ID,
    dropboxAccessToken: DROPBOX_ACCESS_TOKEN,
    dropboxRefreshToken: DROPBOX_REFRESH_TOKEN,
    dropboxAppKey: DROPBOX_APP_KEY,
    dropboxAppSecret: DROPBOX_APP_SECRET,
  };
};
