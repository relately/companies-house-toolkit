export const parseUkDate = (value: string): Date | undefined => {
  const trimmedDateString = value.trim();

  if (trimmedDateString === '') {
    return undefined;
  }

  const [day, month, year] = trimmedDateString.split('/');

  const date = new Date(`${year}-${month}-${day}`);

  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date;
};

export const parseIsoDate = (value: string): Date | undefined => {
  if (typeof value === 'string' && value.match(/\d{4}-\d{2}-\d{2}/)) {
    const date = new Date(value);

    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return undefined;
};

export const formatIsoDate = (value: Date): string =>
  value.toISOString().split('T')[0];

export const convertUkDateToIsoDate = (value: string): string | undefined => {
  const date = parseUkDate(value);

  if (date) {
    return formatIsoDate(date);
  }

  return undefined;
};

export const parseDatFormatDate = (dateString: string): string | undefined => {
  const trimmedDateString = dateString.trim();

  if (trimmedDateString === '' || trimmedDateString === '00000000') {
    return undefined;
  }

  const year = trimmedDateString.slice(0, 4);
  const month = trimmedDateString.slice(4, 6);
  const day = trimmedDateString.slice(6, 8);

  const date = new Date(`${year}-${month}-${day}`);

  if (isNaN(date.getTime())) {
    console.error('Invalid date', trimmedDateString);
    return undefined;
  }

  return `${year}-${month}-${day}`;
};
