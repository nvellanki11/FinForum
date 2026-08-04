import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { supabase } from "../../supabase";
import Spinner from "./Spinner";

function timeAgo(timestamp) {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

    const units = [
        ["year", 31536000],
        ["month", 2592000],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
    ];

    for (const [name, secondsInUnit] of units) {
        const count = Math.floor(seconds / secondsInUnit);
        if (count >= 1) {
            return `${count} ${name}${count === 1 ? "" : "s"} ago`;
        }
    }

    return "just now";
}

export default function Post() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editImageUrl, setEditImageUrl] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true)

            const { data, error } = await supabase
                .from("Posts")
                .select()
                .eq("id", id)
                .single()

            if (data) {
                setPost(data)
            }

            setLoading(false)
        }

        fetchPost()
    }, [id])

    const addComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        const updatedComments = [...(post.comments || []), newComment.trim()];

        const { data, error } = await supabase
            .from("Posts")
            .update({ comments: updatedComments })
            .eq("id", id)
            .select()
            .single()

        if (data) {
            setPost(data)
            setNewComment("")
        }
    }

    const upvote = async () => {
        const { data, error } = await supabase
            .from("Posts")
            .update({ upvotes: post.upvotes + 1 })
            .eq("id", id)
            .select()
            .single()

        if (data) {
            setPost(data)
        }
    }

    const startEditing = () => {
        setEditTitle(post.title)
        setEditContent(post.content)
        setEditImageUrl(post.image_url || "")
        setIsEditing(true)
    }

    const saveEdit = async (e) => {
        e.preventDefault();

        if (!editTitle.trim()) return;

        const { data, error } = await supabase
            .from("Posts")
            .update({
                title: editTitle,
                content: editContent,
                image_url: editImageUrl
            })
            .eq("id", id)
            .select()
            .single()

        if (data) {
            setPost(data)
            setIsEditing(false)
        }
    }

    const deletePost = async () => {
        if (!window.confirm("Delete this post? This cannot be undone.")) return;

        const { error } = await supabase
            .from("Posts")
            .delete()
            .eq("id", id)

        if (!error) {
            navigate("/")
        }
    }

    if (loading) return <div className="page"><Spinner /></div>

    if (!post) return <div className="page">Post not found.</div>

    return (
        <div className="page">
            <div className="post-detail">
                {isEditing ? (
                    <form className="create-form" onSubmit={saveEdit}>
                        <input
                            className="post-title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <input
                            className="body"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <input
                            className="image-url"
                            placeholder="Add an image URL (optional)"
                            value={editImageUrl}
                            onChange={(e) => setEditImageUrl(e.target.value)}
                        />
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </form>
                ) : (
                    <>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        {post.image_url && <img src={post.image_url} alt = {post.title}/>}
                    </>
                )}
                <div className="upvote-row" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <h4>{post.upvotes} people upvoted this</h4>
                    <button className="upvote-btn" onClick={upvote}>▲ Upvote</button>
                </div>
                <h5>{timeAgo(post.creation_time)}</h5>

                <div className="comments-section">
                    <h3>Comments</h3>
                    {post.comments && post.comments.length > 0 ? (
                        <ul>
                            {post.comments.map ((comment, index) => (
                                <li key={index} >{comment}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No comments yet. Start a conversation!</p>
                    )}

                    <form className="comment-form" onSubmit={addComment}>
                        <input
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit">Post</button>
                    </form>
                </div>

                <div className="post-actions" style={{display: "flex", gap: "0.5rem", marginTop: "1rem"}}>
                    <button className="edit-btn" onClick={startEditing}>Edit</button>
                    <button className="delete-btn" onClick={deletePost}>Delete</button>
                </div>
            </div>
        </div>
    )
}