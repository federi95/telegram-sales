import { EventEmitter } from "node:events";

const globalForEmitter = globalThis;

export const eventEmitter =
  globalForEmitter.eventEmitter ??
  // eslint-disable-next-line unicorn/prefer-event-target
  (globalForEmitter.eventEmitter = new EventEmitter());
