import { CommandInteraction } from 'discord.js';
import sdwebui from 'node-sd-webui';
import fs from 'fs';
import { ImgurClient } from "imgur"
import { getEnv } from '../lib/env';

interface Prompts {
  prompt :string,
  negativePrompt: string,
  width: number,
  height: number,
  steps: number,
};
const promts = new Map<string, Prompts>();
const STABLE_DIFFUSION_URL = 'http://127.0.0.1:7860';

const { imgurClientID, imgurClientSecret } = getEnv();
const imgurClient = new ImgurClient({
  clientId: imgurClientID,
  clientSecret: imgurClientSecret,
});

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
  const width = interaction.options.get('width')?
    interaction.options.get('width')?.value as number :
    promts.get(interaction.user.id)?.width as number
  const height = interaction.options.get('height')?
    interaction.options.get('height')?.value as number :
    promts.get(interaction.user.id)?.height as number
  const steps = interaction.options.get('steps')?
    interaction.options.get('steps')?.value as number :
    promts.get(interaction.user.id)?.steps as number

  promts.set(interaction.user.id,{
    prompt: prompt,
    negativePrompt: negativePrompt,
    width: width,
    height: height,
    steps: steps,
  });
  
  const client = sdwebui({ apiUrl: STABLE_DIFFUSION_URL });

  try {
    await interaction.deferReply();
    const response = await client.txt2img({
      prompt: prompt,
      negativePrompt: negativePrompt,
      width: width,
      height: height,
      steps: steps,
      seed: -1,
      batchSize: 1,
      hires: {
        steps: 0,
        denoisingStrength: 0.7,
        upscaler: "Latent",
        upscaleBy: 2,
        resizeWidthTo: 1024,
        resizeHeigthTo: 1024,
      }
    });
    console.log('parameters', response.parameters);

    const info = JSON.parse(response.info);
    console.log('info', info);
    const fileName = `image-${info.job_timestamp}.png`;

    response.images.forEach((image) => {
      fs.writeFileSync(`./out/${fileName}`, image, 'base64');
    });

    const base64data = fs.readFileSync(`./out/${fileName}`, { encoding: "base64" })
    const imgurResponse = await imgurClient.upload({
      image: base64data,
      type: 'base64'
    });
    console.log(imgurResponse.data);

    await interaction.editReply(
      `${interaction.user.displayName}さんが画像生成しました。\n- ${prompt}\n- ${negativePrompt}\n- ${imgurResponse.data.link}`
    );
  } catch (error) {
    await interaction.editReply(
      `ごめんなさい！${interaction.user.displayName}さん！画像生成に失敗したよ🥺`
    );
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
