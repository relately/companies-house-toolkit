import { clean } from 'deep-cleaner';

export const removeEmptyValues = (object: object) => clean(object);
