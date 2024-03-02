/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Spinner, Button } from "flowbite-react";
import PostCard from "../components/PostCard";
import CommentSection from "../components/CommentSection";

function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/post/getPosts?slug=${postSlug}`);
        if (data) {
          setError(false);
          setLoading(false);
          setPost(data.posts[0]); //! data.posts [{}]
        }
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  // console.log(post);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const { data } = await axios.get(`/api/post/getPosts?limit=3`);
        if (data) {
          setRecentPosts(data.posts);
        }
      };

      fetchRecentPosts();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  // if(!post){
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <Spinner size="xl" />
  //     </div>
  //   );

  //   //! Post not available page
  // }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/** POST TITLE */}

      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>

      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>

      {/** POST IMAGE */}

      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-contain "
      />

      {/** DATE PART */}

      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      {/** CONTENT */}

      <div
        className=" p-3 max-w-2xl mx-auto w-full overflow-x-scroll    scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-200 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      {/** COMMENT SECTION */}

      <CommentSection postId={post._id} />

      {/** RECENT POSTS */}

      <div className="flex flex-col justify-center items-center mb-5 mt-5">
        <h1 className="text-2xl mt-5 font-serif">Recent Articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}

export default PostPage;
