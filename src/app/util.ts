export const mapObjectKeys = (mapKey: (key: string) => string) =>
  reduceObject((newObject, key, value) => ({
    ...newObject,
    [mapKey(key)]: value,
  }));

export const mapObjectValues = (
  mapValue: (value: unknown, key: string) => unknown
) =>
  reduceObject((newObject, key, value) => ({
    ...newObject,
    [key]: mapValue(value, key),
  }));

export const filterObjectValues = (
  filterValue: (value: unknown, key: string) => boolean
) =>
  reduceObject((newObject, key, value) =>
    filterValue(value, key) ? { ...newObject, [key]: value } : newObject
  );

type ObjectReducer = (
  newObject: Record<string, unknown>,
  key: string,
  value: unknown
) => Record<string, unknown>;

const reduceObject =
  (reducer: ObjectReducer) =>
  (object: Record<string, unknown>): Record<string, unknown> =>
    Object.keys(object).reduce(
      (newObject, key) => reducer(newObject, key, object[key]),
      {} as Record<string, unknown>
    );
