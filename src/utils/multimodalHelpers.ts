/**
 * Helper functions for multimodal support
 */

import {ModelFile} from './types';

/**
 * Checks if a repository contains vision models based on the presence of mmproj files
 * @param siblings Array of model files in the repository
 * @returns boolean indicating if the repository contains vision models
 */
export function isVisionRepo(siblings: ModelFile[]): boolean {
  return siblings.some(f => /mmproj[-_].+\.gguf$/i.test(f.rfilename));
}

/**
 * Gets the mmproj files from a repository
 * @param siblings Array of model files in the repository
 * @returns Array of mmproj filenames
 */
export function getMmprojFiles(siblings: ModelFile[]): ModelFile[] {
  return siblings.filter(f => /^mmproj[-_].+\.gguf$/i.test(f.rfilename));
}

/**
 * Checks if a model file is a vision model
 * @param filename Model filename
 * @returns boolean indicating if the model is a vision model
 */
export function isVisionModel(filename: string): boolean {
  // Common patterns for vision model filenames
  const visionPatterns = [
    /llava/i,
    /vision/i,
    /vl[-_]/i,
    /visual/i,
    /multimodal/i,
    /clip/i,
    /image/i,
    /bakllava/i,
    /llava-hf/i,
    /llava-v1/i,
    /smolvlm/i,
    /internvl/i,
    /qwen.*vl/i,
  ];

  return visionPatterns.some(pattern => pattern.test(filename));
}

/**
 * Checks if a model file is a projection model
 * @param filename Model filename
 * @returns boolean indicating if the model is a projection model
 */
export function isProjectionModel(filename: string): boolean {
  return /^mmproj[-_].+\.gguf$/i.test(filename);
}

/**
 * Gets the recommended projection model for a vision model
 * @param visionModelFilename Vision model filename
 * @param availableProjModels Array of available projection model filenames
 * @returns The recommended projection model filename or undefined if none found
 */
export function getRecommendedProjectionModel(
  visionModelFilename: string,
  availableProjModels: string[],
): string | undefined {
  // Extract base name to match with projection models
  const baseName = visionModelFilename.replace(/\.gguf$/, '');

  // First try to find a projection model with matching quantization
  const quantMatch = baseName.match(/(q[0-9]+[_-][0-9k]+)/i);
  if (quantMatch) {
    const quantLevel = quantMatch[1].toLowerCase();
    const matchingQuant = availableProjModels.find(p =>
      p.toLowerCase().includes(quantLevel),
    );
    if (matchingQuant) {
      return matchingQuant;
    }
  }

  // Then try to find a projection model with matching model family
  for (const family of ['llava', 'bakllava', 'smolvlm', 'internvl', 'qwen']) {
    if (baseName.toLowerCase().includes(family)) {
      const matchingFamily = availableProjModels.find(p =>
        p.toLowerCase().includes(family),
      );
      if (matchingFamily) {
        return matchingFamily;
      }
    }
  }

  // If no specific match, return the first available projection model
  return availableProjModels[0];
}

/**
 * Gets the LLM files (non-mmproj files) from a repository
 * @param siblings Array of model files in the repository
 * @returns Array of LLM model files
 */
export function getLLMFiles(siblings: ModelFile[]): ModelFile[] {
  return siblings.filter(f => !/^mmproj[-_].+\.gguf$/i.test(f.rfilename));
}
