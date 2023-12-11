/* eslint-disable no-process-exit */
import { Box } from 'ink';
import EventEmitter from 'node:events';
import React, { useEffect, useRef } from 'react';
import { estimateSourceSize } from '../../lib/convert.js';
import { snapshot } from '../../lib/snapshot.js';
import { getSnapshotDate } from '../../lib/snapshot/snapshot.js';
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
  snapshotSource: FileSourceType | DirectorySourceType;
  updatesSource: DirectorySourceType;
  alternativeUpdatesSource?: DirectorySourceType;
  formatterType: FormatterType;
  companies?: string[];
};

export const Snapshot: React.FC<SnapshotProps> = ({
  snapshotSource,
  updatesSource,
  alternativeUpdatesSource,
  companies,
  formatterType,
}: SnapshotProps) => {
  const { messages, addWarning, addError } = useMessages();
  const [status, setStatus] = React.useState('');
  const [isComplete, setIsComplete] = React.useState(false);
  const { progress, setProgress, total } = useProgress(async () => {
    try {
      const sourceSize = await estimateSourceSize('183', snapshotSource);
      const snapshotDate = await getSnapshotDate(snapshotSource);

      const updatesSize = await estimateUpdatesSize(
        updatesSource,
        snapshotDate,
        alternativeUpdatesSource
      );

      return (sourceSize || 0) + updatesSize;
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
        snapshotSource,
        updatesSource,
        alternativeUpdatesSource,
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
