import { ProgressBar, Spinner } from '@inkjs/ui';
import { Box, Text } from 'ink';
import prettyBytes from 'pretty-bytes';
import React from 'react';

type Props = {
  total: number | null | undefined;
  progress: number;
};

export const Progress: React.FC<Props> = ({ total, progress }: Props) =>
  total ? (
    <Box>
      <Box gap={1}>
        <Box minWidth="60%">
          <ProgressBar value={(progress / total) * 100} />
        </Box>
        <Box minWidth="0%">
          <Text>
            {Math.round((progress / total) * 100)}% | {prettyBytes(progress)} /{' '}
            {prettyBytes(total)}
          </Text>
        </Box>
      </Box>
    </Box>
  ) : total !== null ? (
    <Box>
      <Spinner label="Calculating progress..." />
    </Box>
  ) : null;
