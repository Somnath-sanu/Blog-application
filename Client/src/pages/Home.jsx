/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "flowbite-react";
import HomePage from "../components/HomePage";

function Home() {
  const [posts, setPosts] = useState([]);
  
  const [loading, setLoading] = useState(false);
  // console.log(posts);

  useEffect(() => {
    const allPosts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/post/getPosts");

        if (data) {
          // console.log(data);
          setPosts(data.posts);
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
      {
        posts ? ( 
          posts && posts.map((post) => (
            <HomePage 
            key={post._id}
            post={post}/>
          ))
          
        ) : (
          <div>
          <p>No Posts Available</p>
          </div>
        )
      }
    </div>
  );
}

export default Home;
