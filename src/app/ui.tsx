import { render } from 'ink';
import React from 'react';
import { Convert, ConvertProps } from './ui/convert.js';

export const renderUI = (props: ConvertProps) =>
  render(<Convert {...props} />, { stdout: process.stderr });
