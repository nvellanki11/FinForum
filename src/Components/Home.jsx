import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { supabase } from "../../supabase";
import Spinner from "./Spinner";


export default function Home() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    useEffect(() => {  // Display feed for user whenever navigating to Home
        const fetchPosts = async () => {
            setLoading(true)

            const {data, error} = await supabase
                .from("Posts")
                .select()

            if (error) {
                console.error(error)
            } else if (data) {
                setPosts(data)
            }

            setLoading(false)
        }

        fetchPosts()
    }, [])

    // Displays posts based on recency
    const sortByTime = () => {
        setPosts((prev) =>
            [...prev].sort(
                (a, b) => new Date(b.creation_time) - new Date(a.creation_time)
            )
        )
    }

    // Displays posts based on upvote count ("Hot")
    const sortByVotes = () => {
        setPosts((prev) => [...prev].sort((a, b) => b.upvotes - a.upvotes))
    }

    // Filter posts when using search bar
    // Case-insensitive keyword search, displays all posts if no query
    const visiblePosts = query
        ? posts.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()))
        : posts;

    return (
        <div className="page">
            <div className="sort-bar">
                <h3>Sort By: </h3>
                <button className="sort-btn" onClick={sortByTime}>Time ⏱️</button>
                <button className="sort-btn" onClick={sortByVotes}>Hot 🔥</button>
            </div>

            {query && (
                <p className="search-status">
                    {visiblePosts.length} result{visiblePosts.length === 1 ? "" : "s"} for "{query}"
                </p>
            )}

            {loading && <Spinner />}

            {!loading && visiblePosts.map((post) => (
                <div key={post.id} className="post-card">
                    <h2>{post.title}</h2>
                    <h4>{post.upvotes} people upvoted this</h4>
                    <h5>{new Date(post.creation_time).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short"
                    })}</h5>
                    <Link to={`/post/${post.id}`}>
                        <button className="post-more-btn">More</button>
                    </Link>
                </div>
            ))}
        </div>
    )
}