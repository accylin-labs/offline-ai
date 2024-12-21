import {Model, ModelOrigin} from '../utils/types';
import {chatTemplates, defaultCompletionParams} from '../utils/chat';
import {Platform} from 'react-native';

export const MODEL_LIST_VERSION = 9;

const iosOnlyModels: Model[] = [];

const androidOnlyModels: Model[] = [];

const crossPlatformModels: Model[] = [
  // -------- Gemma --------
  {
    id: 'google/gemma-2-2b-it-GGUF',
    author: 'bartowski',
    name: 'gemma-2-2b-it-GGUF (Q6_K)',
    type: 'Gemma',
    description: 'Question Answering, Summarization, Reasoning',
    size: 2151393120,
    params: 2614341888,
    isDownloaded: false,
    downloadUrl:
      'https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/main/gemma-2-2b-it-Q6_K.gguf?download=true',
    hfUrl: 'https://huggingface.co/bartowski/gemma-2-2b-it-GGUF',
    progress: 0,
    filename: 'gemma-2-2b-it-Q6_K.gguf',
    isLocal: false,
    origin: ModelOrigin.PRESET,
    defaultChatTemplate: {...chatTemplates.gemmaIt},
    chatTemplate: chatTemplates.gemmaIt,
    defaultCompletionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.0,
      penalty_repeat: 1.0,
      stop: ['<end_of_turn>'],
    },
    completionSettings: {
      // https://huggingface.co/google/gemma-7b-it/discussions/38#65d7b14adb51f7c160769fa1
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.0,
      penalty_repeat: 1.0,
      stop: ['<end_of_turn>'],
    },
  },
  {
    id: 'Gemmasutra-Mini-2B-v1-Q6_K.gguf',
    author: 'TheDrummer',
    name: 'Gemmasutra-Mini-2B-v1-GGUF (Q6_K)',
    type: 'Gemma',
    description: 'Role-play',
    size: 2151393152,
    params: 2614341888,
    isDownloaded: false,
    downloadUrl:
      'https://huggingface.co/TheDrummer/Gemmasutra-Mini-2B-v1-GGUF/resolve/main/Gemmasutra-Mini-2B-v1-Q6_K.gguf?download=true',
    hfUrl: 'https://huggingface.co/TheDrummer/Gemmasutra-Mini-2B-v1-GGUF',
    progress: 0,
    filename: 'Gemmasutra-Mini-2B-v1-Q6_K.gguf',
    isLocal: false,
    origin: ModelOrigin.PRESET,
    defaultChatTemplate: {...chatTemplates.gemmasutra},
    chatTemplate: chatTemplates.gemmasutra,
    defaultCompletionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.7,
      penalty_repeat: 1.0,
      stop: ['<end_of_turn>'],
    },
    completionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.7,
      penalty_repeat: 1.0,
      stop: ['<end_of_turn>'],
    },
  },
  // -------- Phi --------
  {
    id: 'Phi-3.5-mini-instruct.Q4_K_M.gguf',
    author: 'QuantFactory',
    name: 'Phi-3.5 mini 4k instruct (Q4_K_M)',
    type: 'Phi',
    description: 'Reasoning (code & math). Multilingual',
    size: 2394648960,
    params: 3821079648,
    isDownloaded: false,
    downloadUrl:
      'https://huggingface.co/QuantFactory/Phi-3.5-mini-instruct-GGUF/resolve/main/Phi-3.5-mini-instruct.Q4_K_M.gguf?download=true',
    hfUrl: 'https://huggingface.co/QuantFactory/Phi-3.5-mini-instruct-GGUF',
    progress: 0,
    filename: 'Phi-3.5-mini-instruct.Q4_K_M.gguf',
    isLocal: false,
    origin: ModelOrigin.PRESET,
    defaultChatTemplate: {...chatTemplates.phi3},
    chatTemplate: chatTemplates.phi3,
    defaultCompletionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.1,
      stop: ['<|end|>'],
    },
    completionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.1,
      stop: ['<|end|>'],
    },
  },
  // -------- Qwen --------
  {
    id: 'qwen2.5-1.5b-instruct-q8_0.gguf',
    author: 'Qwen',
    name: 'Qwen2.5-1.5B-Instruct (Q8_0)',
    type: 'Qwen',
    description: 'Instruction following, Role-play, Multilingual',
    size: 1892387840,
    params: 1777088000,
    isDownloaded: false,
    downloadUrl:
      'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q8_0.gguf?download=true',
    hfUrl: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF',
    progress: 0,
    filename: 'qwen2.5-1.5b-instruct-q8_0.gguf',
    isLocal: false,
    origin: ModelOrigin.PRESET,
    defaultChatTemplate: {...chatTemplates.qwen25},
    chatTemplate: chatTemplates.qwen25,
    defaultCompletionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.5,
      stop: ['<|im_end|>'],
    },
    completionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.5,
      stop: ['<|im_end|>'],
    },
  },
  {
    id: 'qwen2.5-3b-instruct-q5_0.gguf',
    author: 'Qwen',
    name: 'Qwen2.5-3B-Instruct (Q5_0)',
    type: 'Qwen',
    description: 'Instructions, Role-play, Multilingual',
    size: 2384387840,
    params: 3397103616,
    isDownloaded: false,
    downloadUrl:
      'https://huggingface.co/Qwen/Qwen2.5-3B-Instruct-GGUF/resolve/main/qwen2.5-3b-instruct-q5_0.gguf?download=true',
    hfUrl: 'https://huggingface.co/Qwen/Qwen2.5-3B-Instruct-GGUF',
    progress: 0,
    filename: 'qwen2.5-3b-instruct-q5_0.gguf',
    isLocal: false,
    origin: ModelOrigin.PRESET,
    defaultChatTemplate: {...chatTemplates.qwen25},
    chatTemplate: chatTemplates.qwen25,
    defaultCompletionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.5,
      stop: ['<|im_end|>'],
    },
    completionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.5,
      stop: ['<|im_end|>'],
    },
  },
  // -------- Llama --------
  {
    id: 'default-llama-3.2-1b-instruct-q8_0.gguf',
    author: 'hugging-quants',
    name: 'llama-3.2-1b-instruct (Q8_0)',
    type: 'Llama',
    description: 'Instruction following, Summarization, Rewriting',
    size: 1321079200,
    params: 1235814432,
    isDownloaded: false,
    downloadUrl:
      'https://huggingface.co/hugging-quants/Llama-3.2-1B-Instruct-Q8_0-GGUF/resolve/main/llama-3.2-1b-instruct-q8_0.gguf?download=true',
    hfUrl:
      'https://huggingface.co/hugging-quants/Llama-3.2-1B-Instruct-Q8_0-GGUF',
    progress: 0,
    filename: 'default-llama-3.2-1b-instruct-q8_0.gguf',
    isLocal: false,
    origin: ModelOrigin.PRESET,
    defaultChatTemplate: {...chatTemplates.llama32},
    chatTemplate: chatTemplates.llama32,
    defaultCompletionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.5,
      stop: ['<|eot_id|>'],
    },
    completionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.5,
      stop: ['<|eot_id|>'],
    },
  },
  {
    id: 'Llama-3.2-3B-Instruct-Q6_K.gguf',
    author: 'bartowski',
    name: 'Llama-3.2-3B-Instruct (Q6_K)',
    type: 'Llama',
    description: 'Instruction following, Summarization, Rewriting',
    size: 2643853856,
    params: 3212749888,
    isDownloaded: false,
    downloadUrl:
      'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q6_K.gguf?download=true',
    hfUrl: 'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF',
    progress: 0,
    filename: 'Llama-3.2-3B-Instruct-Q6_K.gguf',
    isLocal: false,
    origin: ModelOrigin.PRESET,
    defaultChatTemplate: {...chatTemplates.llama32},
    chatTemplate: chatTemplates.llama32,
    defaultCompletionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.5,
      stop: ['<|eot_id|>'],
    },
    completionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.5,
      stop: ['<|eot_id|>'],
    },
  },
  // -------- SmolLM --------
  {
    id: 'default-bartowski/SmolLM2-1.7B-Instruct-Q8_0.gguf',
    author: 'bartowski',
    name: 'SmolLM2-1.7B-Instruct (Q8_0)',
    type: 'SmolLM',
    description: '',
    size: 1820414944,
    params: 1711376384,
    isDownloaded: false,
    downloadUrl:
      'https://huggingface.co/bartowski/SmolLM2-1.7B-Instruct-GGUF/resolve/main/SmolLM2-1.7B-Instruct-Q8_0.gguf?download=true',
    hfUrl: 'https://huggingface.co/bartowski/SmolLM2-1.7B-Instruct-GGUF',
    progress: 0,
    filename: 'default-SmolLM2-1.7B-Instruct-Q8_0.gguf',
    isLocal: false,
    origin: ModelOrigin.PRESET,
    defaultChatTemplate: chatTemplates.smolLM,
    chatTemplate: chatTemplates.smolLM,
    defaultCompletionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.7,
      stop: ['<|endoftext|>', '<|im_end|>'],
    },
    completionSettings: {
      ...defaultCompletionParams,
      n_predict: 500,
      temperature: 0.7,
      stop: ['<|endoftext|>', '<|im_end|>'],
    },
  },
];

export const defaultModels =
  Platform.OS === 'android'
    ? [...androidOnlyModels, ...crossPlatformModels]
    : [...iosOnlyModels, ...crossPlatformModels];
