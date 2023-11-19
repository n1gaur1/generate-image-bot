import sdwebui from 'node-sd-webui';

const STABLE_DIFFUSION_URL = 'http://127.0.0.1:7860';

export const generateTextToImage = async (
  prompt: string,
  negativePrompt: string,
  width: number,
  height: number,
  steps: number,
  seed: number,
  upScaleBy: number,
) => {
  const client = sdwebui({ apiUrl: STABLE_DIFFUSION_URL });
  return await client.txt2img({
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
};
