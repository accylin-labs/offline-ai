import React from 'react';
import {fireEvent, render, waitFor} from '../../../../jest/test-utils';
import {BenchmarkScreen} from '../BenchmarkScreen';
import {benchmarkStore} from '../../../store';
import {
  mockResult,
  mockSubmittedResult,
} from '../../../../jest/fixtures/benchmark';

// Mock the entire module
jest.mock('../../../api/benchmark', () => ({
  submitBenchmark: jest.fn().mockResolvedValue(undefined),
}));

// Import the mocked function
import {submitBenchmark} from '../../../api/benchmark';

describe('BenchmarkScreen', () => {
  beforeEach(() => {
    benchmarkStore.results = [mockResult, mockSubmittedResult];
    jest.clearAllMocks(); // This will clear submitBenchmark mock as well
  });

  it('renders device info card', () => {
    const {getByText} = render(<BenchmarkScreen />);
    expect(getByText('Device Information')).toBeDefined();
  });

  it('renders benchmark results when available', async () => {
    benchmarkStore.results = [mockResult];
    const {getByText} = render(<BenchmarkScreen />);

    await waitFor(() => {
      expect(getByText('Test Results')).toBeDefined();
      expect(getByText(mockResult.modelName)).toBeDefined();
    });
  });

  it('allows clearing all results after confirmation', async () => {
    benchmarkStore.results = [mockResult];
    const {getByTestId} = render(<BenchmarkScreen />);

    // Click clear all button
    const clearButton = getByTestId('clear-all-button');
    fireEvent.press(clearButton);

    // Confirm in the dialog
    const confirmButton = getByTestId('clear-all-dialog-confirm-button');
    fireEvent.press(confirmButton);

    expect(benchmarkStore.results.length).toBe(0);
  });

  it('keeps results if clear all is cancelled', async () => {
    benchmarkStore.results = [mockResult];
    const {getByTestId} = render(<BenchmarkScreen />);

    // Click clear all button
    const clearButton = getByTestId('clear-all-button');
    fireEvent.press(clearButton);

    // Cancel in the dialog
    const cancelButton = getByTestId('clear-all-dialog-cancel-button');
    fireEvent.press(cancelButton);

    expect(benchmarkStore.results.length).toBe(1);
  });

  it('handles submission of benchmark results', async () => {
    const {getByTestId} = render(<BenchmarkScreen />);

    const submitButton = getByTestId('submit-benchmark-button');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByTestId('share-benchmark-dialog')).toBeDefined();
    });

    const confirmButton = getByTestId('share-benchmark-dialog-confirm-button');
    fireEvent.press(confirmButton);

    await waitFor(() => {
      expect(submitBenchmark).toHaveBeenCalled();
    });
  });
});
