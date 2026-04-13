import { ObjectId } from "mongodb";
import { NotFoundError, ValidationError } from "./errors.js";

export function parseId(raw: string | string[] | undefined, resource = "Resource"): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new NotFoundError(resource);
  return id;
}

export function toObjectId(id: string, label = "Resource"): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new ValidationError(`Invalid ${label} ID format`);
  }
  return new ObjectId(id);
}
