import { Box } from 'ink';
import React, { useEffect } from 'react';
import { FormatterType } from '../../lib/convert.js';
import { snapshot } from '../../lib/snapshot.js';
import {
  DirectorySourceType,
  FileSourceType,
} from '../../lib/sources/index.js';
import { useMessages } from '../hooks/useMessages.js';
import { Messages } from './shared/Messages.js';
import { Summary } from './shared/Summary.js';

export type SnapshotProps = {
  snapshotSource: FileSourceType | DirectorySourceType;
  updatesSource: DirectorySourceType;
  formatterType: FormatterType;
};

export const Snapshot: React.FC<SnapshotProps> = ({
  snapshotSource,
  updatesSource,
  formatterType,
}: SnapshotProps) => {
  const { messages, addWarning, addError } = useMessages();
  const [status, setStatus] = React.useState('');
  const [isComplete, setIsComplete] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    snapshot({ snapshotSource, updatesSource, formatterType })
      .on('finish', () => setIsComplete(true))
      .on('status', (status: string) => {
        setProgress(0);
        setStatus(status);
      })
      .on('progress', (progress: number) =>
        setProgress((prev) => prev + progress)
      )
      .on('error', addError)
      .on('warning', addWarning);
  }, []);

  return (
    <Box flexDirection="column" margin={1} rowGap={1}>
      <Summary
        description="Creating snapshot"
        status={status}
        isComplete={isComplete}
        progress={
          <Box>{progress > 0 ? `${progress} records written` : ''}</Box>
        }
      />

      <Messages messages={messages} />
    </Box>
  );
};