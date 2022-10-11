import { t } from "../trpc";
import { z } from "zod";

export const userRouter = t.router({
    // Define a procedure (function) that
    // ...takes an input and provides a query
    // ...as `user.greet.useQuery()`
    greet: t.procedure
        // Input validation
        .input(z.object({ name: z.string() }))
        .query(({ input }) => {
            // Here you would process
            // any information you'd need
            // ..to return it to your client
            return { text: `Hello, ${input.name}!` };
        }),
});
