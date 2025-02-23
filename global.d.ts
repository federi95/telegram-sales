import EventEmitter from "node:events";

interface DataChangeEvent {
  action: "created" | "deleted" | "updated";
  timestamp: number;
  entity: Product | Channel;
};

/* eslint-disable no-var */
declare global {
  var eventEmitter: EventEmitter<{
    dataChanged: [DataChangeEvent];
  }> | undefined;
  var __instrumentation_setup: boolean | undefined;
}

export {};
