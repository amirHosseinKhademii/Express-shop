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
    params: z.ZodObject<{
        cartId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        cartId: string;
    }, {
        cartId: string;
    }>;
    body: z.ZodObject<{
        productId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        productId: string;
    }, {
        productId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        cartId: string;
    };
    body: {
        productId: string;
    };
}, {
    params: {
        cartId: string;
    };
    body: {
        productId: string;
    };
}>;
//# sourceMappingURL=product.schema.d.ts.map