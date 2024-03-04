/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "flowbite-react";
import HomePage from "../components/HomePage";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

function Home() {
  const [posts, setPosts] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  // console.log(posts);

  const toastOptions = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  };

  if (!currentUser) {
    toast.info("Sign in to create post", toastOptions);
  }

  useEffect(() => {
    const allPosts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/post/getPosts?limit=50");

        if (data) {
          // console.log(data);
          setPosts(data.posts);
          if (data.posts.length > 50) {
            toast.warning("50 posts reached !!!", toastOptions);
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    allPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <Spinner size={"xl"}></Spinner>
      </div>
    );
  }

  // console.log(posts);
  return (
    <div className="min-h-screen">
      {posts ? (
        posts && posts.map((post) => <HomePage key={post._id} post={post} />)
      ) : (
        <div>
          <p>No Posts Available</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Home;
