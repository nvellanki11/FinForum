import { useState } from "react";
import { supabase } from "../../supabase";
import { Form } from "react-router";

export default function Create() {

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [message, setMessage] = useState("");

    const createPost = async (e) => {
        e.preventDefault();

        if (!title) {  // Requirement, other inputs are optional
            setMessage("Error: post needs a title");
            return;
        } else {
            const { data, error } = await supabase
                .from("Posts")
                .insert({
                    title: title,
                    content: body,
                    image_url: imageUrl,
                    upvotes: 0,
                    creation_time: new Date().toISOString(),
                    comments: []
                });

            if (error) {  // Error log to user in case of other reasons
                console.error(error);
                setMessage("Error: Failed to create post");
            } else {  // User indicator
                setMessage("Post created successfully!");
                setTitle("");
                setBody("");
                setImageUrl("");
            }
        }
    }

    return (
        <div className="page">
            <form className="create-form" onSubmit={createPost}>
                <input className="post-title"
                placeholder="Give your post a name!"
                value={title}
                onChange={(e) => setTitle(e.target.value)} />

                <input className="body"
                placeholder="What's on your mind?"
                value={body}
                onChange={(e) => setBody(e.target.value)} />

                <input className="image-url"
                placeholder="Add an image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)} />

                <button type="submit">
                    Create Post
                </button>

                {message && <p className="form-message">{message}</p>}
            </form>
        </div>
    )
}