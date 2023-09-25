import { ProgressBar, Spinner } from '@inkjs/ui';
import { Box, Text } from 'ink';
import React, { useEffect } from 'react';
import { convert } from '../convert.js';
import { FormatterType } from '../convert/formatter.js';
import { SourceType, estimateSourceSize } from '../convert/source.js';

export type ConvertProps = {
  input: string;
  sourceType: SourceType;
  formatterType: FormatterType;
};

export const Convert: React.FC<ConvertProps> = ({
  input,
  sourceType,
  formatterType,
}: ConvertProps) => {
  const [error, setError] = React.useState<Error | null>(null);
  const [total, setTotal] = React.useState<number | null | undefined>(
    undefined
  );
  const [progress, setProgress] = React.useState(0);

  const handleError = (f: () => void) => {
    try {
      f();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error);
      }
    }
  };

  useEffect(() => {
    handleError(() =>
      estimateSourceSize(sourceType, input).then((value) => {
        setTotal(value);
      })
    );
  }, []);

  useEffect(() => {
    if (total !== undefined) {
      handleError(() =>
        convert(input, sourceType, formatterType, () =>
          setProgress((progress) => progress + 1)
        )
      );
    }
  }, [total]);

  useEffect(() => {
    if (error) {
      process.exit(1);
    }
  }, [error]);

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <Box flexDirection="column" margin={1} rowGap={1}>
      <Box>
        {!total || progress < total ? (
          <Text>
            Converting {sourceType === 'stdin' ? 'stdin' : input} to{' '}
            {formatterType}
          </Text>
        ) : (
          <Text>
            Finished Converting {sourceType === 'stdin' ? 'stdin' : input} to{' '}
            {formatterType}
          </Text>
        )}
      </Box>

      {total && progress < total && (
        <Box>
          <Box gap={1}>
            <Box minWidth="60%">
              <ProgressBar value={(progress / total) * 100} />
            </Box>
            <Box minWidth="0%">
              <Text>
                {Math.round((progress / total) * 100)}% | {progress} / {total}
              </Text>
            </Box>
          </Box>
        </Box>
      )}

      {total === undefined && (
        <Box>
          <Spinner label="Calculating progress..." />
        </Box>
      )}
    </Box>
  );
};
