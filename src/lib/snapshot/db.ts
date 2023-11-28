import EventEmitter from 'node:events';
import { mergeDeepRight } from 'ramda';
import { isLevelNotFoundError } from '../util/db.js';
import { calculateValues } from './shared.js';
import {
  CompanySnapshotAddOperation,
  CompanySnapshotDB,
  CompanySnapshotDBBatchOperation,
  CompanySnapshotDeleteOperation,
  CompanySnapshotOperation,
  CompanySnapshotUpdateOperation,
  SnapshotCompany,
} from './types.js';

export type BatchBuffer = Map<string, CompanySnapshotDBBatchOperation>;

export const resolveBatch = async (
  db: CompanySnapshotDB,
  operation: CompanySnapshotOperation,
  eventEmitter: EventEmitter,
  buffer: BatchBuffer,
  batchSize: number
) => {
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

  if (buffer.size >= batchSize) {
    const batch = Array.from(buffer.values());
    buffer.clear();
    return batch;
  }

  return [];
};

const resolveAdd = (
  operation: CompanySnapshotAddOperation,
  buffer: BatchBuffer
) =>
  void buffer.set(operation.key, {
    type: 'put',
    key: operation.key,
    value: calculateValues(operation.value),
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

  const value = calculateValues(
    (existingValue
      ? mergeDeepRight(existingValue, operation.value)
      : operation.value) as SnapshotCompany
  );

  buffer.set(operation.key, {
    type: 'put',
    key: operation.key,
    value,
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
