import { makeDiscordBot, readyDiscordBot, syncSlashCommands } from './lib/discord';
import { getEnv } from './lib/env';
import { slashCommandHandler } from './handler/slashCommandHandler';
import { submitButtonHandler } from './handler/submitButtonHandler';

const { discordBotToken, discordAppID, discordGuildID } = getEnv();
const bot = makeDiscordBot();

// BOT準備
readyDiscordBot(bot);

// スラッシュコマンドの同期
syncSlashCommands(bot, discordAppID, discordGuildID, discordBotToken);

// スラッシュコマンド検出
bot.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    await slashCommandHandler(interaction);
  }else if(interaction.isModalSubmit())
    await submitButtonHandler(interaction);
});

bot.login(discordBotToken);
