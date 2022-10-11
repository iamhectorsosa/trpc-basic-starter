import Link from "next/link";
import { trpc as t } from "../../utils/trpc";

export default function Posts() {
    // Wrapped around @tanstack/react-query
    // Can also destructure to access
    // isLoading, isError, isSuccess, error and data
    const result = t.post.allPosts.useQuery();

    if (result.isLoading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>All Posts</h1>
            {result.data?.posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`} passHref>
                    <a>
                        {post.id}: {post.title}
                    </a>
                </Link>
            ))}
            <p>
                <Link href="/">Home</Link>
            </p>
        </div>
    );
}
