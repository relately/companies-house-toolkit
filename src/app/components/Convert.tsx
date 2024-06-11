/* eslint-disable no-process-exit */
import EventEmitter from 'events';
import { Box } from 'ink';
import React, { useEffect, useState } from 'react';
import { convert, estimateSourceSize } from '../../lib/convert.js';
import { Product } from '../../lib/types/product.js';
import { FormatterType } from '../../lib/util/formatters/types.js';
import { SourceType } from '../../lib/util/sources/types.js';
import { useMessages } from '../hooks/useMessages.js';
import { useProgress } from '../hooks/useProgress.js';
import { Messages } from './shared/Messages.js';
import { Progress } from './shared/Progress.js';
import { Summary } from './shared/Summary.js';

export type ConvertProps = {
  sourceType: SourceType;
  product: Product;
  formatterType: FormatterType;
  companies: Set<string>;
};

export const Convert: React.FC<ConvertProps> = ({
  sourceType,
  product,
  formatterType,
  companies,
}: ConvertProps) => {
  const { messages, addError } = useMessages();
  const { progress, setProgress, total } = useProgress(() => {
    try {
      return estimateSourceSize(product, sourceType);
    } catch (error) {
      if (error instanceof Error && 'message' in error) {
        addError(error.message);
      }

      process.exit(1);
    }
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const eventEmitter = new EventEmitter();
    eventEmitter
      .on('error', (error: string) => {
        addError(error);

        process.exit(1);
      })
      .on('finish', () => {
        setIsComplete(true);
      })
      .on('progress', setProgress);

    void convert(
      { source: sourceType, product, companies, formatterType },
      eventEmitter
    );
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
