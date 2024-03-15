/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "flowbite-react";
import HomePage from "../components/HomePage";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";


function Home() {
  const [posts, setPosts] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  // console.log(posts);

  const [showModal, setShowModal] = useState(true);

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

  // if (!currentUser) {
  //   toast.info("Sign in to create post", toastOptions);

  // }

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
    <div className="min-h-screen relative space-y-10">
      
      {posts ? (
        posts && posts.map((post) => <HomePage key={post._id} post={post} />)
      ) : (
        <div>
          <p>No Posts Available</p>
        </div>
      )}
      {!currentUser && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size={"md"}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Sign In to Create Post
              </h3>
              <div className="flex justify-center gap-4">
                <Link to={"/sign-in"}>
                  <Button
                    color="green"
                    onClick={() => setShowModal(false)}
                    className="bg-green-300"
                  >
                    Let&apos;s do it 😊
                  </Button>
                </Link>
                <Button
                  color="gray"
                  onClick={() => setShowModal(false)}
                  className="bg-red-200"
                >
                  Not now!🥹
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
}

export default Home;
