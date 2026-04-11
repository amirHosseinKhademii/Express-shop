import { NotFoundError } from "./errors.js";

export function parseId(raw: string | string[] | undefined, resource = "Resource"): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new NotFoundError(resource);
  return id;
}
