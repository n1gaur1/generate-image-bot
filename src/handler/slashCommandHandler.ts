import { CommandInteraction } from 'discord.js';
import sdwebui from 'node-sd-webui';
import fs from 'fs';

interface Prompts {
  prompt :string,
  negativePrompt: string,
};
const promts = new Map<string, Prompts>();

const STABLE_DIFFUSION_URL = 'http://127.0.0.1:7860';

export const slashCommandHandler = async (interaction: CommandInteraction) => {
  const { commandName } = interaction;

  switch (commandName) {
    case 'generateimage':
      generateImageHandler(interaction);
      break;
    case 'getimage':
      getImageHandler(interaction);
      break;
    case "regenerateimage":
      getReGenerateImageHandler(interaction);
      break;
    default:
      break;
  }
};

const generateImageHandler = async (interaction: CommandInteraction) => {
  const prompt = interaction.options.get('prompt') ? 
    interaction.options.get('prompt')?.value as string :
    promts.get(interaction.user.id)?.prompt as string
  const negativePrompt = interaction.options.get('negative_prompt')?
    interaction.options.get('negative_prompt')?.value as string :
    promts.get(interaction.user.id)?.negativePrompt as string

  promts.set(interaction.user.id,
    {prompt: prompt, negativePrompt: negativePrompt}
  );
  
  const client = sdwebui({ apiUrl: STABLE_DIFFUSION_URL });

  try {
    await interaction.deferReply();
    const response = await client.txt2img({
      prompt: prompt,
      negativePrompt: negativePrompt,
      width: 512,
      height: 512,
      steps: 28,
      seed: -1,
      batchSize: 1,
    });
    console.log('parameters', response.parameters);

    const info = JSON.parse(response.info);
    console.log('info', info);
    const fileName = `image-${info.job_timestamp}.png`;

    response.images.forEach((image) => {
      fs.writeFileSync(`./out/${fileName}`, image, 'base64');
    });

    await interaction.editReply(
      `${interaction.user.displayName}さんが画像生成しました。\n- ${prompt}\n- ${negativePrompt}\n- ${fileName}`
    );
  } catch (error) {
    console.log(`${error}`);
  }
};

const getImageHandler = async (interaction: CommandInteraction) => {
  const fileName = interaction.options.get('filename')?.value as string;
  try {
    await interaction.reply({
      content: `${fileName}はこれだよ！`,
      files: [`./out/${fileName}`],
    });
  } catch (error) {
    await interaction.reply(`${fileName}が見つからなかったよ🥺`);
  }
};

const getReGenerateImageHandler = async (interaction: CommandInteraction) => {
  if (promts.size !== 0) {
    generateImageHandler(interaction);
  } else {
    await interaction.reply(`前回のプロンプトが見つからなかったよ🥺`);
  }
};
