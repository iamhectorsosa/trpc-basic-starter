import Link from "next/link";
import { FormEvent, ChangeEvent, useState } from "react";
import { trpc as t } from "../../utils/trpc";

export default function NewPost() {
    // User is fixed for simplicity
    const initValue = { title: "", body: "", userId: 1 };
    const [form, setForm] = useState(initValue);

    // Wrapped around @tanstack/react-query
    // Can also destructure to access
    // isLoading, isError, isSuccess, error and data
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
        <div>
            <h1>Create a New Post</h1>
            <p>
                Given the limitations of the prototyping library your post will
                not be stored in the db.
            </p>
            <p>
                All posts are being created with <code>userId: 1</code> and{" "}
                <code>id: 101</code>.
            </p>
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
            {mutation.data?.response && (
                <>
                    <h2>
                        {mutation.data.response.id}:{" "}
                        {mutation.data.response.title}
                    </h2>
                    <p>{mutation.data.response.body}</p>
                </>
            )}
            <p>
                <Link href="/">Home</Link>
            </p>
        </div>
    );
}
