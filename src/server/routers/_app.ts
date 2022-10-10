import { t } from "../trpc";

import { userRouter } from './user';

export const appRouter = t.router({
    user: userRouter, // Write procedures under "user" namespace
});