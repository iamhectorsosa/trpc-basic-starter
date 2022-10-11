import { t } from "../trpc";

import { userRouter } from "./user";
import { postRouter } from "./post";

export const appRouter = t.router({
    user: userRouter, // Write procedures under "user" namespace
    post: postRouter,
});
