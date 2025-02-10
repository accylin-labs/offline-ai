import {useCallback, useState} from 'react';
import {modelStore} from '../store';
import {safeParseJSON} from '../utils';

export const useStructuredOutput = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (
      prompt: string,
      schema: object,
      options?: {
        temperature?: number;
        top_p?: number;
        top_k?: number;
        repeat_penalty?: number;
      },
    ) => {
      if (!modelStore.context) {
        throw new Error('Model context not initialized');
      }

      setIsGenerating(true);
      setError(null);

      try {
        const result = await modelStore.context.completion({
          messages: [{role: 'user', content: prompt}],
          response_format: {
            type: 'json_schema',
            json_schema: {
              strict: true,
              schema,
            },
          },
          temperature: options?.temperature ?? 0.7,
          top_p: options?.top_p ?? 0.9,
          top_k: options?.top_k ?? 40,
          n_predict: 2000,

          stop: ['<|im_end|>', '<end_of_turn>', '<eos>'],
        });

        // Parse the completion text as JSON
        return safeParseJSON(result.text);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to generate output';
        setError(errorMessage);
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    [],
  );

  return {
    generate,
    isGenerating,
    error,
  };
};
