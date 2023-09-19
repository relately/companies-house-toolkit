import { ProgressBar, Spinner } from '@inkjs/ui';
import highland from 'highland';
import { Box, Text } from 'ink';
import fs from 'node:fs';
import React, { useEffect } from 'react';
import { convert } from '../convert.js';
import { FormatterType } from '../convert/formatter.js';
import { SourceType } from '../convert/source.js';

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
  const [total, setTotal] = React.useState<number | undefined>(undefined);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    highland<string>(fs.createReadStream(input))
      .split()
      .reduce(-1, (previous) => previous + 1)
      .map((value) => (value > 0 ? value : 0))
      .toPromise(Promise)
      .then((value) => setTotal(value));
  }, []);

  useEffect(() => {
    if (total) {
      convert(input, sourceType, formatterType, () => {
        setProgress((progress) => progress + 1);
      });
    }
  }, [total]);

  return (
    <Box flexDirection="column" margin={1} rowGap={1}>
      <Box>
        <Text>
          Converting {input} to {formatterType}
        </Text>
      </Box>

      <Box>
        {total ? (
          <Box gap={1}>
            <Box minWidth="75%">
              <ProgressBar value={(progress / total) * 100} />
            </Box>
            <Box minWidth={40}>
              <Text>
                {Math.round((progress / total) * 100)}% | {progress} / {total}
              </Text>
            </Box>
          </Box>
        ) : (
          <Spinner label="Calculating progress..." />
        )}
      </Box>
    </Box>
  );
};
