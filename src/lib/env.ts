export const getEnv = () => {
  const {
    DISCORD_BOT_TOKEN,
    DISCORD_APP_ID,
    DISCORD_GUILD_ID,
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

  return {
    discordBotToken: DISCORD_BOT_TOKEN,
    discordAppID: DISCORD_APP_ID,
    discordGuildID: DISCORD_GUILD_ID,
  };
};
