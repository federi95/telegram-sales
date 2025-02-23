import { Channel } from "@/db/schema";
import { eventEmitter } from "@/lib/event";
import { IData } from "@/types/api";
import { paginate } from "@/utils/query";

import schemas, {
  CreateChannelDto,
  ListChannelDto,
  UpdateChannelDto,
} from "./channel.dto";
import * as channelRepository from "./channel.repository";

async function list(params: ListChannelDto = {}): Promise<IData<Channel>> {
  const { page, limit, sort } = await schemas.list.parseAsync(params);
  const total = await channelRepository.count();
  const pagination = paginate({ page, total, limit });

  if (!total) {
    return {
      ...pagination,
      total,
      data: [],
    };
  }

  const result = await channelRepository.getAll({
    limit,
    page,
    sort,
  });

  return {
    ...pagination,
    data: result,
    total,
  };
}

async function getById(id: number) {
  await schemas.element.parseAsync({ id });
  return channelRepository.getById(id);
}

async function create(channel: CreateChannelDto) {
  const data = await schemas.create.parseAsync(channel);

  const exists = await channelRepository.exists(data);
  if (exists) throw new Error("Channel already exists");

  const _channel = await channelRepository.create(data);

  eventEmitter.emit("dataChanged", {
    action: "created",
    timestamp: Date.now(),
    entity: _channel,
  });

  return _channel;
}

async function update(id: number, channel: UpdateChannelDto) {
  await schemas.element.parseAsync({ id });
  const data = await schemas.update.parseAsync(channel);
  const updated = await channelRepository.update(id, data);

  eventEmitter.emit("dataChanged", {
    action: "updated",
    timestamp: Date.now(),
    entity: updated,
  });

  return updated;
}

async function deleteById(id: number) {
  await schemas.element.parseAsync({ id });
  const deleted = channelRepository.remove(id);

  eventEmitter.emit("dataChanged", {
    action: "deleted",
    timestamp: Date.now(),
    entity: deleted,
  });

  return deleted;
}

export { create, deleteById, getById, list, update };
