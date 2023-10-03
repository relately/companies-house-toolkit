import highland from 'highland';
import EventEmitter from 'node:events';
import { Readable } from 'node:stream';
import { mergeDeepRight } from 'ramda';
import { FormatterType } from '../convert.js';
import { isLevelNotFoundError } from '../util/db.js';
import { formatCompanySnapshot } from './formatter.js';
import {
  CompanySnapshotAddOperation,
  CompanySnapshotDB,
  CompanySnapshotDBBatchOperation,
  CompanySnapshotDeleteOperation,
  CompanySnapshotOperation,
  CompanySnapshotUpdateOperation,
  SnapshotCompany,
} from './types.js';

type BatchBuffer = Map<string, CompanySnapshotDBBatchOperation>;

export const resolveBatch = async (
  db: CompanySnapshotDB,
  operations: CompanySnapshotOperation[],
  eventEmitter: EventEmitter
): Promise<CompanySnapshotDBBatchOperation[]> => {
  const buffer: BatchBuffer = new Map();

  for (const operation of operations) {
    switch (operation.type) {
      case 'add':
        resolveAdd(operation, buffer);
        break;
      case 'update':
        await resolveUpdate(operation, buffer, db, eventEmitter);
        break;
      case 'delete':
        resolveDelete(operation, buffer);
        break;
    }
  }

  return Array.from(buffer.values());
};

export const readValuesFromDb = (
  db: CompanySnapshotDB,
  formatterType: FormatterType
) =>
  highland<SnapshotCompany>(Readable.from(db.values())).through(
    formatCompanySnapshot(formatterType)
  );

const resolveAdd = (
  operation: CompanySnapshotAddOperation,
  buffer: BatchBuffer
) =>
  void buffer.set(operation.key, {
    type: 'put',
    key: operation.key,
    value: operation.value,
  });

const resolveDelete = (
  operation: CompanySnapshotDeleteOperation,
  buffer: BatchBuffer
) => void buffer.set(operation.key, { type: 'del', key: operation.key });

const resolveUpdate = async (
  operation: CompanySnapshotUpdateOperation,
  buffer: BatchBuffer,
  db: CompanySnapshotDB,
  eventEmitter: EventEmitter
) => {
  const existingOperation = buffer.get(operation.key);

  const existingValue =
    existingOperation?.type === 'put'
      ? existingOperation.value
      : await getValueFromDb(operation.key, db, eventEmitter);

  buffer.set(operation.key, {
    type: 'put',
    key: operation.key,
    value: mergeDeepRight(
      existingValue || {},
      operation.value
    ) as SnapshotCompany,
  });
};

const getValueFromDb = async (
  key: string,
  db: CompanySnapshotDB,
  eventEmitter: EventEmitter
) => {
  try {
    return await db.get(key);
  } catch (error) {
    if (isLevelNotFoundError(error)) {
      eventEmitter.emit(
        'warning',
        `Company ${key} had an update transaction but the record could not be found`
      );

      return;
    }

    throw error;
  }
};
