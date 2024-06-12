/* eslint-disable no-process-exit */
import EventEmitter from 'events';
import { Box } from 'ink';
import React, { useEffect, useState } from 'react';
import { load } from '../../lib/load.js';
import { estimateSourceSize } from '../../lib/products/index.js';
import { Product } from '../../lib/types/product.js';
import {
  DirectorySourceType,
  FileSourceType,
} from '../../lib/util/sources/types.js';
import { useMessages } from '../hooks/useMessages.js';
import { useProgress } from '../hooks/useProgress.js';
import { Messages } from './shared/Messages.js';
import { Progress } from './shared/Progress.js';
import { Summary } from './shared/Summary.js';

export type LoadProps = {
  sourceType: DirectorySourceType | FileSourceType;
  additionalSourceType?: DirectorySourceType;
  product: Product;
  connection: {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
  };
};

export const Load: React.FC<LoadProps> = ({
  sourceType,
  additionalSourceType,
  product,
  connection,
}: LoadProps) => {
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
        console.log(error);
        addError(error);

        process.exit(1);
      })
      .on('finish', () => {
        setIsComplete(true);
      })
      .on('progress', setProgress);

    void load(
      {
        source: sourceType,
        additionalSource: additionalSourceType,
        product,
        connection,
      },
      eventEmitter
    );
  }, []);

  return (
    <Box flexDirection="column" margin={1} rowGap={1}>
      <Summary
        description={`Loading ${sourceType.path}`}
        status="loading"
        isComplete={isComplete}
        progress={<Progress total={total} progress={progress} />}
      />

      <Messages messages={messages} />
    </Box>
  );
};
