/* eslint-disable no-process-exit */
import { Box } from 'ink';
import EventEmitter from 'node:events';
import React, { useEffect, useRef } from 'react';
import { estimateSourceSize } from '../../lib/convert.js';
import { snapshot } from '../../lib/snapshot.js';
import { getSnapshotDate } from '../../lib/snapshot/product183.js';
import { estimateUpdatesSize } from '../../lib/snapshot/updates.js';
import { FormatterType } from '../../lib/util/formatters/types.js';
import {
  DirectorySourceType,
  FileSourceType,
} from '../../lib/util/sources/types.js';
import { useMessages } from '../hooks/useMessages.js';
import { useProgress } from '../hooks/useProgress.js';
import { Messages } from './shared/Messages.js';
import { Progress } from './shared/Progress.js';
import { Summary } from './shared/Summary.js';

export type SnapshotProps = {
  product183Source: FileSourceType | DirectorySourceType;
  product101Source: DirectorySourceType;
  product100Source: DirectorySourceType;
  product217Source: FileSourceType | DirectorySourceType;
  formatterType: FormatterType;
  companies?: Set<string>;
};

export const Snapshot: React.FC<SnapshotProps> = ({
  product100Source,
  product101Source,
  product183Source,
  product217Source,
  companies,
  formatterType,
}: SnapshotProps) => {
  const { messages, addWarning, addError } = useMessages();
  const [status, setStatus] = React.useState('');
  const [isComplete, setIsComplete] = React.useState(false);
  const { progress, setProgress, total } = useProgress(async () => {
    try {
      const product217Size = await estimateSourceSize('217', product217Source);
      const product183Size = await estimateSourceSize('183', product183Source);
      const snapshotDate = await getSnapshotDate(product183Source);

      const updatesSize = await estimateUpdatesSize(
        product101Source,
        snapshotDate,
        product100Source
      );

      return (product217Size || 0) + (product183Size || 0) + updatesSize;
    } catch (error) {
      if (error instanceof Error && 'message' in error) {
        addError(error.message);
      }

      process.exit(1);
    }
  });

  const progressRef = useRef(progress);
  const setProgressThrottled = (step: number) => {
    progressRef.current += step;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress(progressRef.current);
    }, 1000);

    const eventEmitter = new EventEmitter();
    eventEmitter
      .on('finish', () => {
        clearInterval(intervalId);
        setIsComplete(true);
      })
      .on('status', setStatus)
      .on('progress', (progress: number) => {
        setProgressThrottled(progress);
      })
      .on('error', addError)
      .on('warning', addWarning);

    snapshot(
      {
        product183Source,
        product101Source,
        product100Source,
        product217Source,
        companies,
        formatterType,
      },
      eventEmitter
    );

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Box flexDirection="column" margin={1} rowGap={1}>
      <Summary
        description="Creating snapshot"
        status={status}
        isComplete={isComplete}
        progress={<Progress total={total} progress={progress} />}
      />

      <Messages messages={messages} />
    </Box>
  );
};
