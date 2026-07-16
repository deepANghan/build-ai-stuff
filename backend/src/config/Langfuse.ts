import { Langfuse } from "langfuse";

export const langfuse = new Langfuse({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY as string,
    secretKey: process.env.LANGFUSE_SECRET_KEY as string,
    baseUrl: process.env.LANGFUSE_BASE_URL as string
});