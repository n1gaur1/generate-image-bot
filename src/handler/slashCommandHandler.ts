import { CommandInteraction } from 'discord.js';
import { buildModalDialogFirst } from '../view/buildModalDialog';

export const slashCommandHandler = async (interaction: CommandInteraction) => {
  const { commandName } = interaction;

  switch (commandName) {
    case 'generateimage':
      await buildModalDialogFirst(interaction);
      break;
    default:
      break;
  }
};

