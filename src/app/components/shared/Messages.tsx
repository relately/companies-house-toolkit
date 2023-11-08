import { StatusMessage } from '@inkjs/ui';
import { Static } from 'ink';
import React from 'react';
import { Message } from '../../hooks/useMessages.js';

type Props = {
  messages: Message[];
};

export const Messages: React.FC<Props> = ({ messages }: Props) => {
  return (
    <Static items={messages}>
      {(message) => (
        <StatusMessage key={message.content} variant={message.type}>
          {message.content}
        </StatusMessage>
      )}
    </Static>
  );
};
