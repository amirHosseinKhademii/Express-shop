import { z } from "zod";
export declare const createProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        price: z.ZodNumber;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        price: number;
        description?: string | undefined;
    }, {
        title: string;
        price: number;
        description?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title: string;
        price: number;
        description?: string | undefined;
    };
}, {
    body: {
        title: string;
        price: number;
        description?: string | undefined;
    };
}>;
export declare const updateProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title?: string | undefined;
        price?: number | undefined;
        description?: string | undefined;
    }, {
        title?: string | undefined;
        price?: number | undefined;
        description?: string | undefined;
    }>;
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        title?: string | undefined;
        price?: number | undefined;
        description?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        title?: string | undefined;
        price?: number | undefined;
        description?: string | undefined;
    };
}>;
export declare const productIdParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
export declare const addProductToCartSchema: z.ZodObject<{
    body: z.ZodObject<{
        productId: z.ZodPipeline<z.ZodEffects<z.ZodNumber, number, unknown>, z.ZodNumber>;
        quantity: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodNumber>>, number, unknown>;
    }, "strip", z.ZodTypeAny, {
        productId: number;
        quantity: number;
    }, {
        productId?: unknown;
        quantity?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        productId: number;
        quantity: number;
    };
}, {
    body: {
        productId?: unknown;
        quantity?: unknown;
    };
}>;
export declare const removeProductFromCartSchema: z.ZodObject<{
    body: z.ZodObject<{
        productId: z.ZodPipeline<z.ZodEffects<z.ZodNumber, number, unknown>, z.ZodNumber>;
        quantity: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodNumber>>, number, unknown>;
    }, "strip", z.ZodTypeAny, {
        productId: number;
        quantity: number;
    }, {
        productId?: unknown;
        quantity?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        productId: number;
        quantity: number;
    };
}, {
    body: {
        productId?: unknown;
        quantity?: unknown;
    };
}>;
export declare const createOrderSchema: z.ZodObject<{
    body: z.ZodUnion<[z.ZodObject<{
        fromCart: z.ZodLiteral<true>;
        items: z.ZodOptional<z.ZodUndefined>;
    }, "strip", z.ZodTypeAny, {
        fromCart: true;
        items?: undefined;
    }, {
        fromCart: true;
        items?: undefined;
    }>, z.ZodObject<{
        fromCart: z.ZodDefault<z.ZodOptional<z.ZodLiteral<false>>>;
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodPipeline<z.ZodEffects<z.ZodNumber, number, unknown>, z.ZodNumber>;
            quantity: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodNumber>>, number, unknown>;
        }, "strip", z.ZodTypeAny, {
            productId: number;
            quantity: number;
        }, {
            productId?: unknown;
            quantity?: unknown;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        items: {
            productId: number;
            quantity: number;
        }[];
        fromCart: false;
    }, {
        items: {
            productId?: unknown;
            quantity?: unknown;
        }[];
        fromCart?: false | undefined;
    }>]>;
}, "strip", z.ZodTypeAny, {
    body: {
        fromCart: true;
        items?: undefined;
    } | {
        items: {
            productId: number;
            quantity: number;
        }[];
        fromCart: false;
    };
}, {
    body: {
        fromCart: true;
        items?: undefined;
    } | {
        items: {
            productId?: unknown;
            quantity?: unknown;
        }[];
        fromCart?: false | undefined;
    };
}>;
export declare const orderIdParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
//# sourceMappingURL=product.schema.d.ts.map