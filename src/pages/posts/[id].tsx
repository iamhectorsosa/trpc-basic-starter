import { useRouter } from "next/router";
import Link from "next/link";
import { trpc as t } from "../../utils/trpc";

export default function Post() {
    const id = useRouter().query.id as string;
    // Wrapped around @tanstack/react-query
    // Can also destructure to access
    // isLoading, isError, isSuccess, error and data
    const result = t.post.postById.useQuery({ id });

    if (result.isLoading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div>
            <h2>
                {result.data?.post.id}: {result.data?.post.title}
            </h2>
            <p>{result.data?.post.body}</p>
            <p>
                <Link href="/">Home</Link>
            </p>
        </div>
    );
}
