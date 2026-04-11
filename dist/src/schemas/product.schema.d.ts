import { z } from "zod";
export declare const createProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        title: string;
        price: number;
    }, {
        title: string;
        price: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title: string;
        price: number;
    };
}, {
    body: {
        title: string;
        price: number;
    };
}>;
export declare const updateProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        title?: string | undefined;
        price?: number | undefined;
    }, {
        title?: string | undefined;
        price?: number | undefined;
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
    };
}, {
    params: {
        id: string;
    };
    body: {
        title?: string | undefined;
        price?: number | undefined;
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