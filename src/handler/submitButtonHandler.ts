import { ModalSubmitInteraction } from 'discord.js';
import { beforeParameter } from '../model/GenerateImageParameter';
import { deleteLocalImage } from '../utility/fileUtility';
import { generateTextToImage } from '../generator/generateImage';
import fs from 'fs';
import { deleteDropboxImage, uploadImageToDropbox } from '../utility/dropboxUtility';

export const submitButtonHandler = async (interaction: ModalSubmitInteraction) => {
  
  switch(interaction.customId)
  {
    case 'submit':
      await generateImage(interaction);
      break;
    default:
      break;
  }
};

const generateImage = async (interaction: ModalSubmitInteraction) => {

  try {
    await interaction.deferUpdate();

    // 前回のファイルを削除する
    if (beforeParameter.size !== 0) {
      const beforeFileName = beforeParameter.get(interaction.user.id)?.fileName as string
      deleteLocalImage(beforeFileName);
      await deleteDropboxImage(beforeFileName);
    }

    // テキストから画像ファイルを生成し、Dropboxにアップロードする
    const {
      resultPrompt,
      resultNegativePrompt,
      resultWidth,
      resultHeight,
      resultSteps,
      resultUpScaleBy,
      resultSeed,
      resultFileName,
    } = await textToImage(interaction);
    const downloadLink = await uploadImageToDropbox(resultFileName);
    await interaction.followUp(
      `${interaction.user.displayName}さんが画像生成しました。\n- ${resultSeed} \n- ${downloadLink[0]}`
    );

    // 前回値として保存する
    beforeParameter.set(interaction.user.id,{
      prompt: resultPrompt,
      negativePrompt: resultNegativePrompt,
      width: resultWidth,
      height: resultHeight,
      steps: resultSteps,
      upScaleBy: resultUpScaleBy,
      seed: resultSeed,
      fileName: resultFileName,
    });
  } catch (error) {
    await interaction.followUp(
      `ごめんなさい！${interaction.user.displayName}さん！画像生成に失敗したよ🥺\n${error}`
    );
    console.log(`${error}`);
  }
};

const textToImage = async (interaction: ModalSubmitInteraction) => {
  try {
    const prompt = interaction.fields.getTextInputValue("prompt")
    const negativePrompt = interaction.fields.getTextInputValue("negativePrompt")
    const width = parseFloat(interaction.fields.getTextInputValue("width"))
    const height = parseFloat(interaction.fields.getTextInputValue("height"))
    const etc = interaction.fields.getTextInputValue("etc").split(",")
    const steps = parseInt(etc[0]);
    const upScaleBy = parseFloat(etc[1]);
    const seed = parseInt(etc[2]);

    const response = await generateTextToImage(
      prompt, negativePrompt, width, height, steps, seed, upScaleBy
    );
    console.log('parameters', response.parameters);

    const info = JSON.parse(response.info);
    console.log('info', info);
    const fileName = `image-${info.job_timestamp}.png`;

    response.images.forEach((image) => {
      fs.writeFileSync(`./out/${fileName}`, image, 'base64');
    });

    return {
      resultPrompt: info.prompt,
      resultNegativePrompt: info.negative_prompt,
      resultWidth: info.width,
      resultHeight: info.height,
      resultSteps: info.steps,
      resultUpScaleBy: info.extra_generation_params['Hires upscale'],
      resultSeed: info.seed,
      resultFileName: fileName,
    };

  } catch (error) {
    console.log(error);
    throw new Error(`Stable Diffusionによる画像生成に失敗しました。`);
  }
};
