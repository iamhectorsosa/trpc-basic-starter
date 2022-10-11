import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../pages/api/trpc/[trpc]";

function getBaseUrl() {
    if (typeof window !== "undefined") {
        // In the browser, we return a relative URL
        return "";
    }
    // When rendering on the server, we return an absolute URL

    // Reference for vercel.com
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // Assumes localhost or defaults to 3000
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
    // Can pass an ctx input that gives you access to the Next.js req object, among other things
    config() {
        return {
            // Links enables you to customize the flow of data between tRPC Client and the tRPC-server
            links: [
                httpBatchLink({
                    url: getBaseUrl() + "/api/trpc",
                }),
            ],
        };
    },
    // Whether tRPC should await queries when server-side rendering a page
    ssr: true,
});
