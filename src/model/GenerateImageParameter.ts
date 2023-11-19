export interface GenerateImageParameter {
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  steps: number;
  upScaleBy: number;
  fileName: string;
  seed: number;
}

export const beforeParameter = new Map<string, GenerateImageParameter>()
