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
      .addIntegerOption((option) =>
        option
          .setName("width")
          .setDescription("横幅")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("height")
          .setDescription("縦幅")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("steps")
          .setDescription("ステップ数")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("upscaleby")
          .setDescription("アップスケール倍数")
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
      .setName('regenerateimage')
      .setDescription('前回と同じプロンプトでAIが画像生成します。')
      .toJSON(),
  ];
};
