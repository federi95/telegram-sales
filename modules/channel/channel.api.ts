import { Channel } from "@/db/schema";
import { axios } from "@/lib/api";
import { IData } from "@/types/api";

import { CreateChannelDto, ListChannelDto, UpdateChannelDto } from "./channel.dto";

export const getChannels = async (
  parameters?: ListChannelDto,
  signal?: AbortSignal
) =>
  await axios
    .get<IData<Channel>>("/api/channels", { params: parameters, signal })
    .then((res) => res.data);

export const getChannel = async (id: number) =>
  await axios.get<Channel>(`/api/channels/${id}`).then((res) => res.data);

export const createChannel = async (data: CreateChannelDto) =>
  await axios.post<Channel>("/api/channels", data).then((res) => res.data);

export const updateChannel = async (id: number, data: UpdateChannelDto) =>
  await axios
    .patch<Channel>(`/api/channels/${id}`, data)
    .then((res) => res.data);

export const deleteChannel = async (id: number) =>
  await axios.delete(`/api/channels/${id}`);
