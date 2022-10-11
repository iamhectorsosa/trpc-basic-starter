# tRPC: Understanding Typesafety

Typesafety is the extent to which a programming language prevents type errors. The process of verifying and enforcing the constraints of types may occur at compile time or at run-time. A programming language like [TypeScript](https://typefully.com/) checks a program for errors before execution (at compile time) as a static type checker. In contrast, a library like [Zod](https://zod.dev/) also provides you with type checking at run-time. So how does a library like tRPC helps us better understand typesafety?

> tRPC allows you to easily build and consume fully typesafe APIs, without schemas or code generation.

At its core, [tRPC](https://trpc.io/) provides the solution to better statically type our API endpoints and share those types between our client and server, enabling type safety from end-to-end.

## How does tRPC share types between client/server?

Types are shared based on one or many _procedures_ contained in Routers. A **procedure** is a _composable_ query, mutation or subscription where you define how your client/server interact with each other.

Let's see what you'd need to create a query procedure for a [Next.js application](https://trpc.io/docs/v10/nextjs). We'll explore these concepts by reviewing our [tRPC-basic-starter](https://github.com/ekqt/trpc-basic-starter) GH repo. Here's how our file structure would initially look like:

```graphql
# @path: ./src
├── pages
│   └── api/trpc
│       └── [trpc].ts # <-- tRPC HTTP handler
│   └── _app.tsx      # <-- tRPC Provider
│   └── index.tsx
│   └── [...]
├── server
│   └── routers
│       └── _app.ts   # <-- Main app router
│       └── user.ts   # <-- User sub-router
│       └── [...]     # <-- More sub-routers
│   └── trpc.ts       # <-- Procedure helpers
├── utils
│   └── trpc.ts       # <-- Typesafe tRPC hooks
```

You could define all of your procedures within the **tRPC HTTP handler** and completely skip the server directory. However, this wouldn't be a scalable approach. It is very likely that your backend will require multiple endpoints, for which it is recommended to separate your procedures into different sub-routers and merge them as suggested in the file structure above.

To create a query procedure, at the most basic level we need to define an `input` (optional and validated with your library of choice), and a `query` (the actual implementation of the procedure) which runs a function returning the data you need. At the end, the types of each router are exported to provide a fully-typed experience on the client without importing any server code.

```typescript
// @path: ./src/server/routers/user.ts
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
```

## Using your new tRPC-backend on the client

[@tRPC/react](https://trpc.io/docs/v10/react-queries) provides a set of hooks wrapped around [@tanstack/react-query](https://tanstack.com/query/v4/docs/guides/queries), so under the hood, they work just the same to fetch data from a server. You'll notice that the conventional _querying keys and functions_ are defined within your procedure.

```tsx
// @path: ./src/pages/index.tsx
import { trpc as t } from "../utils/trpc";

export default function Home() {
    // Wrapped around @tanstack/react-query
    // Can also destructure to access
    // isLoading, isError, isSuccess, error and data
    const result = t.user.greet.useQuery({ name: "Client" });

    if (result.isLoading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>{result.data?.text}</h1>
        </div>
    );
}
```

...and that's the basic setup. Both the result and input are type-inferred from the procedures as defined and will get **TypeScript autocompletion and IntelliSense** that matches your backend API without requiring any code generation.

## More examples of tRPC usage

Let's create an additional sub-router `@path: ./src/server/routers/post.ts` where we need to provide our client with the following: (a) fetch all posts, (b) fetch post by ID, (c) create a new post. Notice that requirements for `a` and `b` are different than for `c`, as the first two are query procedures and the last one requires a **mutation procedure**. However, you will notice that there is _no difference_ between queries and mutation apart from semantics.

```typescript
import { t } from "../trpc";
import { z } from "zod";

type PostType = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

export const postRouter = t.router({
    // Define a procedure that
    // ...doesn't require an input and provides a query
    // ...as `post.allPosts.useQuery()`
    allPosts: t.procedure.query(async () => {
        const allPosts = await fetch(
            "https://jsonplaceholder.typicode.com/posts"
        ).then((response) => response.json());
        return { posts: posts as Array<PostType> };
    }),
    // Define a procedure that
    // ...takes an id and provides a query
    // ...as `post.postById.useQuery({ id })`
    postById: t.procedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const post = await fetch(
                `https://jsonplaceholder.typicode.com/posts/${input.id}`
            ).then((response) => response.json());
            return { post: post as PostType };
        }),
});
```

## How could we use procedures?

[Procedures](https://trpc.io/docs/v10/quickstart#add-a-query-procedure) are able to resolve any custom function to process a validated `{ input }`. Just to name a few examples: you could make use of an ORM like [Prisma](https://www.prisma.io/), a Baas like [Supabase](https://supabase.com), or a headless CMS like [Sanity](https://www.sanity.io/) to process your data with the benefits of fully typesafe APIs.

## What about Mutations?

[Mutations](https://tanstack.com/query/v4/docs/guides/mutations) are typically used to create/update/delete data. Let's take a look on how we could create a mutation procedure using our Post sub-router:

```typescript
import { t } from "../trpc";
import { z } from "zod";

type PostType = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

export const postRouter = t.router({
    // Define a procedure that
    // ...takes an id and executes a mutation
    // ...as `post.createPost.useMutation()`
    // ...from `*.mutate({ input })`
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
                { method: "POST", body: JSON.stringify(input) }
            ).then((response) => response.json());
            return { response: post as PostType };
        }),
});
```

Here is how we could execute that mutation from the client:

```tsx
import { FormEvent, ChangeEvent, useState } from "react";
import { trpc as t } from "../../utils/trpc";

export default function NewPost() {
    // User is fixed for simplicity
    const initValue = { title: "", body: "", userId: 1 };
    const [form, setForm] = useState(initValue);
    const mutation = t.post.createPost.useMutation();

    function handleChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm({ ...form, [e.target.id]: e.target.value });
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        mutation.mutate(form);
        setForm(initValue);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
            />
            <label htmlFor="body">Body</label>
            <textarea
                id="body"
                name="body"
                value={form.body}
                onChange={handleChange}
            />
            <button type="submit">Submit</button>
        </form>
    );
}
```

> Mutations are as simple to do as queries, they're actually the same underneath, but are just exposed differently as syntactic sugar and produce a HTTP POST rather than a GET request.

## So WIFY by using tRPC?

What's in it for you using tRPC? We barely scratched the surface, here are a list of features?

-   Full static typesafety with autocompletion on the client, inputs, outputs and errors.
-   No code generation, run-time bloat, or build pipeline.
-   Zero dependencies and a tiny client-side footprint.
-   All requests are able to be batched automatically into one.
-   Framework agnostic and compatible with all JavaScript frameworks and runtimes.

Feel free to explore this example using the resources below:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ekqt/trpc-basic-starter?file=src/pages/index.tsx&file=src/server/routers/user.ts&view=editor)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ekqt/trpc-basic-starter)
