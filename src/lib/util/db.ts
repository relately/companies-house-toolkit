export const isLevelNotFoundError = (error: unknown): boolean =>
  error instanceof Error && 'code' in error && error.code === 'LEVEL_NOT_FOUND';
