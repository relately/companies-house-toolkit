export const mapObjectKeys =
  (mapKey: (key: string) => string) =>
  (object: Record<string, unknown>): Record<string, unknown> =>
    Object.keys(object).reduce(
      (newObject, key) => {
        newObject[mapKey(key)] = object[key];

        return newObject;
      },
      {} as Record<string, unknown>
    );
