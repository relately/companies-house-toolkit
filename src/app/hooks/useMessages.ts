import { useState } from 'react';

export type Message = {
  type: 'error' | 'warning';
  content: string;
};

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addError = (content: string) => {
    setMessages((messages) => [...messages, { type: 'error', content }]);
  };

  const addWarning = (content: string) => {
    setMessages((messages) => [...messages, { type: 'warning', content }]);
  };

  return {
    addError,
    addWarning,
    messages,
  };
};
