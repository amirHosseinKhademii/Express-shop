import "dotenv/config";
export declare const config: {
    readonly env: string;
    readonly port: number;
    readonly database: {
        readonly postgresUrl: string;
        readonly mongoUri: string;
    };
    readonly jwt: {
        readonly secret: string;
        readonly refreshSecret: string;
        readonly expiresIn: string;
        readonly refreshExpiresIn: string;
    };
};
//# sourceMappingURL=index.d.ts.map