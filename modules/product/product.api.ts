import { Product } from "@/db/schema";
import { axios } from "@/lib/api";
import { IData } from "@/types/api";

import {
  CreateProductDto,
  ListProductDto,
  UpdateProductDto,
} from "./product.dto";

export const getProducts = async (
  parameters?: ListProductDto,
  signal?: AbortSignal
) =>
  await axios
    .get<IData<Product>>("/api/products", { params: parameters, signal })
    .then((res) => res.data);

export const getProduct = async (id: number) =>
  await axios.get<Product>(`/api/products/${id}`).then((res) => res.data);

export const createProduct = async (data: CreateProductDto) =>
  await axios.post<Product>("/api/products", data).then((res) => res.data);

export const updateProduct = async (id: number, data: UpdateProductDto) =>
  await axios
    .patch<Product>(`/api/products/${id}`, data)
    .then((res) => res.data);

export const deleteProduct = async (id: number) =>
  await axios.delete(`/api/products/${id}`);
