import { SlashCommandBuilder } from 'discord.js';

export const buildSlashCommands = ():
ReturnType<typeof SlashCommandBuilder.prototype.toJSON>[] => {
  return [
    new SlashCommandBuilder()
      .setName('generateimage')
      .setDescription('AIで画像生成します。')
      .addStringOption((option) =>
        option
          .setName("prompt")
          .setDescription("呪文1")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("negative_prompt")
          .setDescription("呪文2")
          .setRequired(true)
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName('getimage')
      .setDescription('AIで生成した画像を取得します。')
      .addStringOption((option) =>
        option
          .setName("filename")
          .setDescription("ファイル名")
          .setRequired(true)
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName('regenetateimage')
      .setDescription('前回と同じプロンプトでAIが画像生成します。')
      .toJSON(),
  ];
};
