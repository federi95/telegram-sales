import { z } from "zod";

const list = z.object({
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().default(10).optional(),
  sort: z.string().optional(),
});

const create = z.object({
  name: z.string().nonempty(),
  url: z.string().url(),
  cron: z.string().regex(/^(\d+)([smhdw])$/),
});

const update = z.object({
  name: z.string().nonempty().optional(),
  url: z.string().url().optional(),
  cron: z
    .string()
    .regex(/^(\d+)([smhdw])$/)
    .optional(),
});

const element = z.object({
  id: z.number().int().positive(),
});

export type CreateChannelDto = z.infer<typeof create>;
export type UpdateChannelDto = z.infer<typeof update>;
export type ListChannelDto = z.infer<typeof list>;

export default {
  list,
  create,
  update,
  element,
};
