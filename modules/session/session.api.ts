import { Session } from "@/db/schema";
import { axios } from "@/lib/api";
import { IData } from "@/types/api";

import { ListSessionDto } from "./session.dto";

export const getSessions = async (
  parameters?: ListSessionDto,
  signal?: AbortSignal
) =>
  await axios
    .get<IData<Session>>("/api/sessions", { params: parameters, signal })
    .then((res) => res.data);

export const deleteSession = async (id: number) =>
  await axios.delete(`/api/sessions/${id}`);
