export function pickDefined(body, fields) {
    const result = {};
    for (const key of fields) {
        if (body[key] !== undefined)
            result[key] = body[key];
    }
    return result;
}
//# sourceMappingURL=pick-defined.js.map