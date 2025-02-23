import { z } from "zod";

const list = z.object({
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().default(10).optional(),
  sort: z.string().optional(),
});

const create = z.object({
  session: z.string().nonempty(),
});

const element = z.object({
  id: z.number().int().positive(),
});

export type ListSessionDto = z.infer<typeof list>;
export type CreateSessionDto = z.infer<typeof create>;

export default {
  create,
  list,
  element,
};
