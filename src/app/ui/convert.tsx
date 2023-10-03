/* eslint-disable no-process-exit */
import { ProgressBar, Spinner } from '@inkjs/ui';
import { Box, Text } from 'ink';
import prettyBytes from 'pretty-bytes';
import React, { useEffect } from 'react';
import { convert } from '../convert.js';
import { FormatterType } from '../convert/formatter.js';
import { ParserType } from '../convert/parser.js';
import { SourceType, estimateSourceSize } from '../convert/source.js';

export type ConvertProps = {
  sourceType: SourceType;
  parserType: ParserType;
  formatterType: FormatterType;
};

export const Convert: React.FC<ConvertProps> = ({
  sourceType,
  parserType,
  formatterType,
}: ConvertProps) => {
  const [error, setError] = React.useState<Error | null>(null);
  const [total, setTotal] = React.useState<number | null | undefined>(
    undefined
  );
  const [progress, setProgress] = React.useState(0);

  const handleError = (f: () => unknown) => {
    try {
      f();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error);
      }
    }
  };

  useEffect(() => {
    handleError(async () => {
      const value = await estimateSourceSize(sourceType);
      setTotal(value);
    });
  }, []);

  useEffect(() => {
    if (total !== undefined) {
      handleError(() =>
        convert(sourceType, parserType, formatterType, (progress) =>
          setProgress(progress)
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
            Converting {sourceType.type === 'stdin' ? 'stdin' : sourceType.path}{' '}
            to {formatterType}
          </Text>
        ) : (
          <Text>
            Finished Converting{' '}
            {sourceType.type === 'stdin' ? 'stdin' : sourceType.path} to{' '}
            {formatterType}
          </Text>
        )}
      </Box>

      {total && (
        <Box>
          <Box gap={1}>
            <Box minWidth="60%">
              <ProgressBar value={(progress / total) * 100} />
            </Box>
            <Box minWidth="0%">
              <Text>
                {Math.round((progress / total) * 100)}% |{' '}
                {prettyBytes(progress)} / {prettyBytes(total)}
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
