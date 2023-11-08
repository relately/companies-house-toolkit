import { Text } from 'ink';
import React from 'react';

type Props = {
  description: string;
  status: string;
  isComplete: boolean;
  progress: React.ReactNode;
};

export const Summary: React.FC<Props> = ({
  description,
  status,
  isComplete,
  progress,
}: Props) => {
  return (
    <>
      <Text>{description}</Text>

      <Text>{isComplete ? 'Finished' : status}</Text>

      {progress}
    </>
  );
};
