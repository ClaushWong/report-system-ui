export const API = {
    HOST: process.env.NEXT_PUBLIC_API_HOST,
    TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT_MS
        ? Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS)
        : 30000,
};
