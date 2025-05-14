import {makeAutoObservable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {
  AssistantFormData,
  PalType,
  RoleplayFormData,
  CameraPalFormData,
} from '../components/PalsSheets/types';

export type Pal = {id: string} & (
  | AssistantFormData
  | RoleplayFormData
  | CameraPalFormData
);
export type AssistantPal = Pal & {palType: PalType.ASSISTANT};
export type RoleplayPal = Pal & {palType: PalType.ROLEPLAY};
export type CameraPal = Pal & {palType: PalType.CAMERA};

class PalStore {
  pals: Pal[] = [];

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'PalStore',
      properties: ['pals'],
      storage: AsyncStorage,
    });
  }

  addPal = (data: AssistantFormData | RoleplayFormData | CameraPalFormData) => {
    const newPal = {
      id: uuidv4(),
      ...data,
    } as Pal;
    this.pals.push(newPal);
  };

  updatePal = (
    id: string,
    data: Partial<AssistantFormData | RoleplayFormData | CameraPalFormData>,
  ) => {
    const palIndex = this.pals.findIndex(p => p.id === id);
    if (palIndex !== -1) {
      const currentPal = this.pals[palIndex];
      this.pals[palIndex] = {
        ...currentPal,
        ...data,
        palType: currentPal.palType,
      } as Pal;
    }
  };

  deletePal = (id: string) => {
    const palIndex = this.pals.findIndex(p => p.id === id);
    if (palIndex !== -1) {
      this.pals.splice(palIndex, 1);
    }
  };

  getPals = () => {
    return this.pals;
  };
}

export const palStore = new PalStore();

// Create the default "Lookie" CameraPal if it doesn't exist
export const initializeLookiePal = () => {
  // Check if Lookie already exists
  const lookiePal = palStore.pals.find(
    p => p.palType === PalType.CAMERA && p.name === 'Lookie',
  );

  if (!lookiePal) {
    // Create the Lookie pal
    const lookieData: CameraPalFormData = {
      name: 'Lookie',
      palType: PalType.CAMERA,
      systemPrompt:
        'You are Lookie, an AI assistant that analyzes images through the camera. ' +
        "You have a fun, slightly quirky personality and you're enthusiastic about seeing the world through the user's camera. " +
        'When analyzing images, be detailed and helpful, but maintain your excited personality. ' +
        'Describe what you see in the image with accuracy and enthusiasm. ' +
        "If you're unsure about something in the image, be honest about it. " +
        'Always be respectful and appropriate in your descriptions.',
      useAIPrompt: false,
      isSystemPromptChanged: false,
      color: ['#4CAF50', '#81C784'], // Green colors
    };

    palStore.addPal(lookieData);
  }
};
