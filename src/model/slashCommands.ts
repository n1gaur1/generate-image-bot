import { SlashCommandBuilder } from 'discord.js';

export const buildSlashCommands = (): ReturnType<typeof SlashCommandBuilder.prototype.toJSON>[] => 
{
  return [
    new SlashCommandBuilder()
      .setName('generateimage')
      .setDescription('AIで画像生成します。')
      .toJSON(),
  ];
};
