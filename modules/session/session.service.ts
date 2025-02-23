import { Session } from "@/db/schema";
import { IData } from "@/types/api";
import { paginate } from "@/utils/query";

import schemas, { CreateSessionDto, ListSessionDto } from "./session.dto";
import * as sessionRepository from "./session.repository";

async function list(params: ListSessionDto = {}): Promise<IData<Session>> {
  const { page, limit, sort } = await schemas.list.parseAsync(params);
  const total = await sessionRepository.count();
  const pagination = paginate({ page, total, limit });

  if (!total) {
    return {
      ...pagination,
      total,
      data: [],
    };
  }

  const result = await sessionRepository.getAll({
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

async function create(session: CreateSessionDto) {
  const { session: data } = await schemas.create.parseAsync(session);
  return sessionRepository.create(data);
}

async function getFirst() {
  return sessionRepository.get();
}

async function deleteById(id: number) {
  await schemas.element.parseAsync({ id });
  return sessionRepository.remove(id);
}

export { create, deleteById, getFirst, list };
