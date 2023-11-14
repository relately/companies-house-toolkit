export type StdinSourceType = {
  type: 'stdin';
};

export type FileSourceType = {
  type: 'file';
  path: string;
};

export type DirectorySourceType = {
  type: 'directory';
  path: string;
};

export type SourceType = StdinSourceType | FileSourceType | DirectorySourceType;

export type DirectoryFileSelection = Date | 'latest' | 'all';
