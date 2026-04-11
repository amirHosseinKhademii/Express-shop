export function pickDefined(body: Record<string, unknown>, fields: readonly string[]) {
  const result: Record<string, unknown> = {};
  for (const key of fields) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result;
}
