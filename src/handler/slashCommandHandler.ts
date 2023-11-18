import { CommandInteraction } from 'discord.js';
import sdwebui from 'node-sd-webui';
import fs from 'fs';
import { Dropbox } from "dropbox"
import { getEnv } from '../lib/env';

interface Prompts {
  prompt :string,
  negativePrompt: string,
  width: number,
  height: number,
  steps: number,
  upScaleBy: number,
  fileName: string,
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
  const width = interaction.options.get('width')?
    interaction.options.get('width')?.value as number :
    promts.get(interaction.user.id)?.width as number
  const height = interaction.options.get('height')?
    interaction.options.get('height')?.value as number :
    promts.get(interaction.user.id)?.height as number
  const steps = interaction.options.get('steps')?
    interaction.options.get('steps')?.value as number :
    promts.get(interaction.user.id)?.steps as number
  const upScaleBy = interaction.options.get('upscaleby')?
    interaction.options.get('upscaleby')?.value as number :
    promts.get(interaction.user.id)?.upScaleBy as number
  const seed = interaction.options.get('seed')?
    interaction.options.get('seed')?.value as number : -1;

  try {
    interaction.deferReply();

    // 前回のファイルを削除する
    if (promts.size !== 0) {
      const beforeFileName = promts.get(interaction.user.id)?.fileName as string
      deleteLocalImage(beforeFileName);
      await deleteDropboxImage(beforeFileName);
    }

    // テキストから画像ファイルを生成し、Dropboxにアップロードする
    const {fileName, resultSeed} = await textToImage(prompt, negativePrompt, width, height, steps, upScaleBy, seed);
    const downloadLink = await uploadImageToDropbox(fileName);

    // 前回値として保存する
    promts.set(interaction.user.id,{
      prompt: prompt,
      negativePrompt: negativePrompt,
      width: width,
      height: height,
      steps: steps,
      upScaleBy: upScaleBy,
      fileName: fileName,
    });
    
    await interaction.editReply(
      `${interaction.user.displayName}さんが画像生成しました。\n- ${prompt}\n- ${negativePrompt}\n- ${resultSeed}\n- ${downloadLink[0]}`
    );
  } catch (error) {
    await interaction.editReply(
      `ごめんなさい！${interaction.user.displayName}さん！画像生成に失敗したよ🥺\n${error}`
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
    const fileName = promts.get(interaction.user.id)?.fileName as string
    deleteLocalImage(fileName);
    await deleteDropboxImage(fileName);
    generateImageHandler(interaction);
  } else {
    await interaction.reply(`前回のプロンプトが見つからなかったよ🥺`);
  }
};

const textToImage = async (
  prompt: string,
  negativePrompt: string,
  width: number,
  height: number,
  steps: number,
  upScaleBy: number,
  seed: number
) => {
  try {
    const client = sdwebui({ apiUrl: STABLE_DIFFUSION_URL });
    const response = await client.txt2img({
      prompt: prompt,
      negativePrompt: negativePrompt,
      width: width,
      height: height,
      steps: steps,
      seed: seed,
      batchSize: 1,
      hires: {
        steps: 0,
        denoisingStrength: 0.7,
        upscaler: 'Latent',
        upscaleBy: upScaleBy,
      },
    });
    console.log('parameters', response.parameters);

    const info = JSON.parse(response.info);
    console.log('info', info);
    const fileName = `image-${info.job_timestamp}.png`;

    response.images.forEach((image) => {
      fs.writeFileSync(`./out/${fileName}`, image, 'base64');
    });

    return {
      fileName: fileName,
      resultSeed: info.seed,
    };

  } catch (error) {
    console.log(error);
    throw new Error(`Stable Diffusionによる画像生成に失敗しました。`);
  }
};

const uploadImageToDropbox = async (fileName: string) => {
  const {
    dropboxAccessToken,
    dropboxRefreshToken,
    dropboxAppKey,
    dropboxAppSecret,
  } = getEnv();

  try {
    const dropboxClient = new Dropbox({
      accessToken: dropboxAccessToken,
      refreshToken: dropboxRefreshToken,
      clientId: dropboxAppKey,
      clientSecret: dropboxAppSecret,
    });

    const buffer = fs.readFileSync(`./out/${fileName}`);
    await dropboxClient.filesUpload({
      path: `/${fileName}`,
      contents: buffer,
    });
    await dropboxClient.sharingCreateSharedLinkWithSettings({
      path: `/${fileName}`,
    });
    const sharingLinks = await dropboxClient.sharingListSharedLinks({
      path: `/${fileName}`,
      direct_only: true,
    });

    return sharingLinks.result.links.map((link) =>
      link.url.replace('www.dropbox', 'dl.dropboxusercontent')
    );
  } catch (error) {
    console.log(error);
    throw new Error(`Dropboxへのアップロードに失敗しました。`);
  }
};

const deleteLocalImage = (fileName: string) => {
  if (fs.existsSync(`./out/${fileName}`)) {
    fs.unlinkSync(`./out/${fileName}`);
    console.log(`${fileName} deleted successfully.`);
  } else {
    console.log(`${fileName} not found.`);
  }
};

const deleteDropboxImage = async (fileName: string) => {
  const {
    dropboxAccessToken,
    dropboxRefreshToken,
    dropboxAppKey,
    dropboxAppSecret,
  } = getEnv();

  try {
    const dropboxClient = new Dropbox({
      accessToken: dropboxAccessToken,
      refreshToken: dropboxRefreshToken,
      clientId: dropboxAppKey,
      clientSecret: dropboxAppSecret,
    });

    await dropboxClient.filesDeleteV2({
      path: `/${fileName}`
    });

    console.log(`${fileName} deleted successfully from Dropbox.`);
    
  } catch (error) {
    console.log(`Dropboxの${fileName}の削除に失敗しました。`);
  }
};
