/* eslint-disable no-process-exit */
import { Box } from 'ink';
import React, { useEffect, useState } from 'react';
import {
  FormatterType,
  ProductType,
  SourceType,
  convert,
  estimateSourceSize,
} from '../../lib/convert.js';
import { useMessages } from '../hooks/useMessages.js';
import { useProgress } from '../hooks/useProgress.js';
import { Messages } from './shared/Messages.js';
import { Progress } from './shared/Progress.js';
import { Summary } from './shared/Summary.js';

export type ConvertProps = {
  sourceType: SourceType;
  productType: ProductType;
  formatterType: FormatterType;
};

export const Convert: React.FC<ConvertProps> = ({
  sourceType,
  productType,
  formatterType,
}: ConvertProps) => {
  const { messages, addError } = useMessages();
  const { progress, setProgress, total } = useProgress(() => {
    try {
      return estimateSourceSize(sourceType);
    } catch (error) {
      if (error instanceof Error && 'message' in error) {
        addError(error.message);
      }

      process.exit(1);
    }
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    convert(sourceType, productType, formatterType)
      .on('error', (error: string) => {
        addError(error);

        process.exit(1);
      })
      .on('finish', () => {
        setIsComplete(true);
      })
      .on('progress', setProgress);
  }, []);

  return (
    <Box flexDirection="column" margin={1} rowGap={1}>
      <Summary
        description={`Converting ${
          sourceType.type === 'stdin' ? 'stdin' : sourceType.path
        } to ${formatterType}`}
        status="converting"
        isComplete={isComplete}
        progress={<Progress total={total} progress={progress} />}
      />

      <Messages messages={messages} />
    </Box>
  );
};
