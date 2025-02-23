import { z } from "zod";

const list = z.object({
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().default(10).optional(),
  sort: z.string().optional(),
});

const create = z.object({
  name: z.string().nonempty(),
  channelId: z.number().int().positive(),
});

const update = z.object({
  name: z.string().nonempty().optional(),
  channelId: z.number().int().positive().optional(),
});

const element = z.object({
  id: z.number().int().positive(),
});

export type CreateProductDto = z.infer<typeof create>;
export type UpdateProductDto = z.infer<typeof update>;
export type ListProductDto = z.infer<typeof list>;

export default {
  list,
  create,
  update,
  element,
};
