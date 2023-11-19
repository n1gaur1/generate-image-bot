import {
  ActionRowBuilder,
  CommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { beforeParameter } from '../model/GenerateImageParameter';

export const buildModalDialogFirst = async (interaction: CommandInteraction) => {
  const prompt = beforeParameter.get(interaction.user.id)?
                    beforeParameter.get(interaction.user.id)?.prompt as string : "";
  const negativePrompt = beforeParameter.get(interaction.user.id)?
                    beforeParameter.get(interaction.user.id)?.negativePrompt as string : "";
  const width = beforeParameter.get(interaction.user.id)?
                    beforeParameter.get(interaction.user.id)?.width as number : 512;
  const height = beforeParameter.get(interaction.user.id)?
                    beforeParameter.get(interaction.user.id)?.height as number : 512;
  const steps = beforeParameter.get(interaction.user.id)?
                    beforeParameter.get(interaction.user.id)?.steps as number : 20;
  const upScaleBy = beforeParameter.get(interaction.user.id)?
                      beforeParameter.get(interaction.user.id)?.upScaleBy as number : 1;
  const seed = beforeParameter.get(interaction.user.id)?
                  beforeParameter.get(interaction.user.id)?.seed as number : -1;

  const modal = new ModalBuilder()
    .setCustomId('submit')
    .setTitle('Please input parameter');

  const promptInput = new TextInputBuilder()
    .setCustomId('prompt')
    .setLabel('プロンプト')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false)
    .setValue(prompt);
  const negativePromptInput = new TextInputBuilder()
    .setCustomId('negativePrompt')
    .setLabel('ネガティブプロンプト')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false)
    .setValue(negativePrompt);
  const widthInput = new TextInputBuilder()
    .setCustomId('width')
    .setLabel('横幅')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setValue(width.toString());
  const heightInput = new TextInputBuilder()
    .setCustomId('height')
    .setLabel('縦幅')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setValue(height.toString());
  const etcInput = new TextInputBuilder()
    .setCustomId('etc')
    .setLabel('ステップ数, アップスケール倍数, Seed数')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setValue(`${steps}, ${upScaleBy}, ${seed}`);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(promptInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(negativePromptInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(widthInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(heightInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(etcInput),
  );

  await interaction.showModal(modal);
};
