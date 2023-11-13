import highland from 'highland';

export const getStdinStream = () => highland<string>(process.stdin);
