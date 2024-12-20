import {makeAutoObservable} from 'mobx';
import {BenchmarkResult} from '../../src/utils/types';
import {mockResult} from '../../jest/fixtures/benchmark';

class MockBenchmarkStore {
  results: BenchmarkResult[] = [mockResult];

  constructor() {
    makeAutoObservable(this);
  }

  addResult = jest.fn((result: BenchmarkResult) => {
    this.results.unshift(result);
  });

  removeResult = jest.fn((timestamp: string) => {
    this.results = this.results.filter(
      result => result.timestamp !== timestamp,
    );
  });

  clearResults = jest.fn(() => {
    this.results = [];
  });

  getResultsByModel = jest.fn((modelId: string): BenchmarkResult[] => {
    return this.results.filter(result => result.modelId === modelId);
  });

  get latestResult(): BenchmarkResult | undefined {
    return this.results[0];
  }

  markAsSubmitted = jest.fn((uuid: string) => {
    const result = this.results.find(r => r.uuid === uuid);
    if (result) {
      result.submitted = true;
    }
  });
}

export const mockBenchmarkStore = new MockBenchmarkStore();
