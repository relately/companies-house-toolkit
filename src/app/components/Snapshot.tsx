import { Box, Static, Text } from 'ink';
import React, { useEffect } from 'react';
import { FormatterType } from '../../lib/convert.js';

import { StatusMessage } from '@inkjs/ui';
import { snapshot } from '../../lib/snapshot.js';
import {
  DirectorySourceType,
  FileSourceType,
} from '../../lib/sources/index.js';

export type SnapshotProps = {
  snapshotSource: FileSourceType | DirectorySourceType;
  updatesSource: DirectorySourceType;
  formatterType: FormatterType;
};

type Message = {
  type: 'error' | 'warning';
  content: string;
};

export const Snapshot: React.FC<SnapshotProps> = ({
  snapshotSource,
  updatesSource,
  formatterType,
}: SnapshotProps) => {
  const [isComplete, setIsComplete] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const [messages, setMessages] = React.useState<Message[]>([]);

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
      .on('error', (error: string) =>
        setMessages((prev) => [...prev, { type: 'error', content: error }])
      )
      .on('warning', (warning: string) =>
        setMessages((prev) => [...prev, { type: 'warning', content: warning }])
      );
  }, []);

  return (
    <Box flexDirection="column" margin={1} rowGap={1}>
      <Text>Creating snapshot...</Text>

      <Text>{isComplete ? 'Finished' : status}</Text>

      <Text>{progress > 0 ? `${progress} records written` : ''}</Text>

      <Static items={messages}>
        {(message) => (
          <StatusMessage key={message.content} variant={message.type}>
            {message.content}
          </StatusMessage>
        )}
      </Static>
    </Box>
  );
};
