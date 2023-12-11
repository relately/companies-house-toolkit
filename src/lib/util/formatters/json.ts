import indentString from 'indent-string';
import { Transform } from 'node:stream';
import { removeEmptyValues } from '../objects.js';

export const formatJson = <T extends object>(): Transform => {
  let first = true;

  return new Transform({
    objectMode: true,

    transform(object: T, _encoding, callback) {
      let json = JSON.stringify(removeEmptyValues(object), undefined, 2);
      json = indentString(json, 2);

      if (first) {
        this.push('[\n');
        first = false;
      } else {
        this.push(',\n');
      }

      this.push(json);
      callback();
    },

    flush(callback) {
      this.push('\n]\n\n');
      callback();
    },
  });
};
