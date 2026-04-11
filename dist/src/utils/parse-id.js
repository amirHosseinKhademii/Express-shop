import { NotFoundError } from "./errors.js";
export function parseId(raw, resource = "Resource") {
    const value = Array.isArray(raw) ? raw[0] : raw;
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0)
        throw new NotFoundError(resource);
    return id;
}
//# sourceMappingURL=parse-id.js.map