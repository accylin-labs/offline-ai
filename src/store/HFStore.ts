import {makeAutoObservable, runInAction} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {makePersistable} from 'mobx-persist-store';

import {fetchGGUFSpecs, fetchModelFilesDetails, fetchModels} from '../api/hf';

import {urls} from '../config';

import {hasEnoughSpace, hfAsModel} from '../utils';
import {ErrorState, createErrorState} from '../utils/errors';

import {HuggingFaceModel} from '../utils/types';

const RE_GGUF_SHARD_FILE =
  /^(?<prefix>.*?)-(?<shard>\d{5})-of-(?<total>\d{5})\.gguf$/;

class HFStore {
  models: HuggingFaceModel[] = [];
  isLoading = false;
  error: ErrorState | null = null;
  nextPageLink: string | null = null;
  searchQuery = '';
  queryFilter = 'gguf,conversational';
  queryFull = true;
  queryConfig = true;
  hfToken: string | null = null;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'HFStore',
      properties: ['hfToken'], // TODO: Add Token need to be stored in keychain or secure storage
      storage: AsyncStorage,
    });
  }

  get isTokenPresent(): boolean {
    return !!this.hfToken && this.hfToken.trim().length > 0;
  }

  async setToken(token: string) {
    try {
      console.log('Setting HF token:', token);
      runInAction(() => {
        this.hfToken = token;
      });
      return true;
    } catch (error) {
      console.error('Failed to save HF token:', error);
      return false;
    }
  }

  async clearToken() {
    try {
      runInAction(() => {
        this.hfToken = null;
      });
      return true;
    } catch (error) {
      console.error('Failed to clear HF token:', error);
      return false;
    }
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  clearError() {
    this.error = null;
  }

  // Fetch the GGUF specs for a specific model,
  // such as number of parameters, context length, chat template, etc.
  async fetchAndSetGGUFSpecs(modelId: string) {
    try {
      const specs = await fetchGGUFSpecs(modelId);
      const model = this.models.find(m => m.id === modelId);
      if (model) {
        runInAction(() => {
          model.specs = specs;
        });
      }
    } catch (error) {
      console.error('Failed to fetch GGUF specs:', error);
      runInAction(() => {
        this.error = createErrorState(error, 'modelDetails', 'huggingface');
      });
    }
  }

  private async updateSiblingsWithFileDetails(
    model: HuggingFaceModel,
    fileDetails: any[],
  ) {
    return Promise.all(
      model.siblings.map(async file => {
        const details = fileDetails.find(
          detail => detail.path === file.rfilename,
        );
        if (!details) {
          return {...file};
        }

        const enrichedFile = {
          ...file,
          size: details.size,
          oid: details.oid,
          lfs: details.lfs,
        };

        return {
          ...enrichedFile,
          canFitInStorage: await hasEnoughSpace(hfAsModel(model, enrichedFile)),
        };
      }),
    );
  }

  // Fetch the details (sizes, oid, lfs, ...) of the model files
  async fetchModelFileDetails(modelId: string) {
    try {
      console.log('Fetching model file details for', modelId);
      const fileDetails = await fetchModelFilesDetails(modelId);
      const model = this.models.find(m => m.id === modelId);

      if (!model) {
        return;
      }

      const updatedSiblings = await this.updateSiblingsWithFileDetails(
        model,
        fileDetails,
      );

      runInAction(() => {
        model.siblings = updatedSiblings;
      });
    } catch (error) {
      console.error('Error fetching model file sizes:', error);
      runInAction(() => {
        this.error = createErrorState(error, 'modelDetails', 'huggingface');
      });
    }
  }

  getModelById(id: string): HuggingFaceModel | null {
    return this.models.find(model => model.id === id) || null;
  }

  async fetchModelData(modelId: string) {
    try {
      await this.fetchAndSetGGUFSpecs(modelId);
      await this.fetchModelFileDetails(modelId);
    } catch (error) {
      console.error('Error fetching model data:', error);
      runInAction(() => {
        this.error = createErrorState(error, 'modelDetails', 'huggingface');
      });
    }
  }

  /** Filters out non-GGUF and sharded GGUF files from model siblings */
  private filterGGUFFiles(siblings: any[]) {
    return (
      siblings?.filter(sibling => {
        const filename = sibling.rfilename.toLowerCase();
        return filename.endsWith('.gguf') && !RE_GGUF_SHARD_FILE.test(filename);
      }) || []
    );
  }

  /** Adds download URLs to model files based on modelId */
  private addDownloadUrls(modelId: string, siblings: any[]) {
    return siblings.map(sibling => ({
      ...sibling,
      url: urls.modelDownloadFile(modelId, sibling.rfilename),
    }));
  }

  // Process the hf search results to:
  // - add the URL
  // - filter out non-gguf files from the siblings
  // - filter out sharded gguf files from the siblings
  private processSearchResults(models: HuggingFaceModel[]) {
    return models.map(model => {
      const filteredSiblings = this.filterGGUFFiles(model.siblings);
      const siblingsWithUrl = this.addDownloadUrls(model.id, filteredSiblings);

      return {
        ...model,
        url: urls.modelWebPage(model.id),
        siblings: siblingsWithUrl,
      };
    });
  }

  get hasMoreResults() {
    return this.nextPageLink !== null;
  }

  // Fetch the models from the Hugging Face API
  async fetchModels() {
    this.isLoading = true;
    this.error = null;

    try {
      const {models, nextLink} = await fetchModels({
        search: this.searchQuery,
        limit: 10,
        sort: 'downloads',
        direction: '-1',
        filter: this.queryFilter,
        full: this.queryFull,
        config: this.queryConfig,
      });

      const modelsWithUrl = this.processSearchResults(models);

      runInAction(() => {
        this.models = modelsWithUrl;
        this.nextPageLink = nextLink;
      });
    } catch (error) {
      runInAction(() => {
        this.error = createErrorState(error, 'search', 'huggingface');
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // Fetch the next page of models
  async fetchMoreModels() {
    if (!this.nextPageLink || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const {models, nextLink} = await fetchModels({
        nextPageUrl: this.nextPageLink,
      });

      const modelsWithUrl = this.processSearchResults(models);

      runInAction(() => {
        modelsWithUrl.forEach(model => this.models.push(model));
        this.nextPageLink = nextLink;
      });
    } catch (error) {
      runInAction(() => {
        this.error = createErrorState(error, 'search', 'huggingface');
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const hfStore = new HFStore();
