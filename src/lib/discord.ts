import {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import { buildSlashCommands } from '../model/slashCommands';

export interface SlashCommand {
  builder: ReturnType<typeof SlashCommandBuilder.prototype.toJSON>;
}

export const makeDiscordBot = () => {
  return new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel],
  });
};

export const readyDiscordBot = async (bot: Client<boolean>) => {
  bot.on('ready', () => {
    console.log(`Logged in as ${bot.user?.tag}!`);
  });
};

export const syncSlashCommands = async (
  bot: Client<boolean>,
  clientId: string,
  guildId: string,
  token: string,
) => {
  try
  {
    const slashCommandBulders = buildSlashCommands();

    const rest = new REST({ version: '9' }).setToken(token);
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: slashCommandBulders,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

