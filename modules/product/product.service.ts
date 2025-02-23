import { Product } from "@/db/schema";
import { eventEmitter } from "@/lib/event";
import { IData } from "@/types/api";
import { paginate } from "@/utils/query";

import schemas, {
  CreateProductDto,
  ListProductDto,
  UpdateProductDto,
} from "./product.dto";
import * as productRepository from "./product.repository";

async function list(params: ListProductDto = {}): Promise<IData<Product>> {
  const { page, limit, sort } = await schemas.list.parseAsync(params);
  const total = await productRepository.count();
  const pagination = paginate({ page, total, limit });

  if (!total) {
    return {
      ...pagination,
      total,
      data: [],
    };
  }

  const result = await productRepository.getAll({
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
  return productRepository.getById(id);
}

async function create(product: CreateProductDto) {
  const data = await schemas.create.parseAsync(product);

  const exists = await productRepository.exists(data);
  if (exists) throw new Error("Product already exists");

  const _product = await productRepository.create(data);

  eventEmitter.emit("dataChanged", {
    action: "created",
    timestamp: Date.now(),
    entity: _product,
  });

  return _product;
}

async function update(id: number, product: UpdateProductDto) {
  await schemas.element.parseAsync({ id });
  const data = await schemas.update.parseAsync(product);
  const updated = await productRepository.update(id, data);

  eventEmitter.emit("dataChanged", {
    action: "updated",
    timestamp: Date.now(),
    entity: updated,
  });

  return updated;
}

async function deleteById(id: number) {
  await schemas.element.parseAsync({ id });
  const deleted = await productRepository.remove(id);

  eventEmitter.emit("dataChanged", {
    action: "deleted",
    timestamp: Date.now(),
    entity: deleted,
  });

  return deleted;
}

export { create, deleteById, getById, list, update };
