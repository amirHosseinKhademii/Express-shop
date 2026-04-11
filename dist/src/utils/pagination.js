const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
export function parsePagination(req, maxLimit = MAX_LIMIT, defaultLimit = DEFAULT_LIMIT) {
    const page = Math.max(parseInt(req.query["page"]) || DEFAULT_PAGE, 1);
    const limit = Math.min(Math.max(parseInt(req.query["limit"]) || defaultLimit, 1), maxLimit);
    const offset = (page - 1) * limit;
    return { page, limit, offset };
}
//# sourceMappingURL=pagination.js.map