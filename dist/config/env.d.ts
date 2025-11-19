declare const env: {
    nodeEnv: string;
    port: number;
    mongoUri: string;
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    smtp: {
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
    };
    sepay: {
        apiKey: string;
        secret: string;
        endpoint: string;
        callbackUrl: string;
        returnUrl: string;
    };
    cloudinary: {
        url: string | undefined;
        folder: string;
    };
    admin: {
        email: string;
        password: string;
    };
};
export default env;
//# sourceMappingURL=env.d.ts.map