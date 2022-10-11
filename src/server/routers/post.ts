import { t } from "../trpc";
import { z } from "zod";

export const postRouter = t.router({
    allPosts: t.procedure.query(async () => {
        const allPosts = await fetch(
            "https://jsonplaceholder.typicode.com/posts"
        ).then((response) => response.json());
        const posts = allPosts.slice(0, 10);
        console.log(posts);
        return {
            posts: posts as Array<PostType>,
        };
    }),
    postById: t.procedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const post = await fetch(
                `https://jsonplaceholder.typicode.com/posts/${input.id}`
            ).then((response) => response.json());
            console.log(post);
            return {
                post: post as PostType,
            };
        }),
    createPost: t.procedure
        .input(
            z.object({
                title: z.string().min(1),
                body: z.string().min(1),
                userId: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const post = await fetch(
                "https://jsonplaceholder.typicode.com/posts",
                {
                    method: "POST",
                    body: JSON.stringify(input),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            ).then((response) => response.json());
            console.log(post);
            return {
                response: post as PostType,
            };
        }),
});

// CODE BELOW IS NOT PART OF tRPC SETUP

type PostType = {
    userId: number;
    id: number;
    title: string;
    body: string;
};
