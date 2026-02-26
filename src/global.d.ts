import { Types } from 'mongoose';

export {};

declare global {
  type OnlyProperties<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: T[K];
  };

  type WithId<T> = T & { _id: Types.ObjectId['_id'] };
}
