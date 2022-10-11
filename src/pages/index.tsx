import Link from "next/link";
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
            <Contact />
            <Link href="/posts/new">Create a new post</Link>
            <Link href="/posts">View all posts</Link>
        </div>
    );
}

// CODE BELOW IS NOT PART OF tRPC SETUP

const Contact = () => {
    return (
        <>
            <h2>Welcome to your tRPC starter!</h2>
            <p>
                If you get stuck, check <a href="https://trpc.io">the docs</a>,
                write a message in tRPC&apos;s{" "}
                <a href="https://trpc.io/discord">Discord-channel</a>, or write
                a message in{" "}
                <a href="https://github.com/trpc/trpc/discussions">
                    GitHub Discussions
                </a>
                .
            </p>
        </>
    );
};
