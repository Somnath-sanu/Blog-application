/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function HomePage({ post }) {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await axios.get(`/api/user/${post.userId}`);

        if (data) {
          // console.log(data);
          setUsers(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, [post]);

  // console.log(users);
  return (
    <div className=" max-w-[80vw] text-ellipsis overflow-hidden">
      <div className="max-h-[10rem] mt-4 m-10 shadow hover:shadow-lg flex justify-between transition-all truncate md:flex-col relative text-ellipsis overflow-hidden">
        <div className=" p-4  flex flex-col">
          <div className="w-[80%] h-full ">
            <div className=" hidden sm:inline">
              <span className="rounded-full w-5 h-5 inline-block overflow-hidden ">
                <img
                  src={users && users.profilePicture}
                  alt="user"
                  className="object-contain"
                />
              </span>
              <span className="px-2 text-gray-500">
                {users && users.username}
              </span>
            </div>
            <span className="px-2 text-gray-500">
              {post && new Date(post.createdAt).toLocaleDateString()}
            </span>
            <Link to={`/post/${post.slug}`}>
              <h1 className="text-black dark:text-white font-bold sm:text-3xl pb-2  text-ellipsis overflow-hidden text-wrap sm:text-nowrap text-xl truncate">
                {post && post.title}
              </h1>
            </Link>
          </div>
          <div
            className="text-black dark:text-white  
               max-w-[50vw] h-full font-serif text-ellipsis overflow-hidden "
          >
            <p
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="truncate text-wrap dark:text-white  overflow-hidden hidden sm:inline w-fit"
            ></p>
          </div>
        </div>

        <Link to={`/post/${post.slug}`}>
          <div className="w-40 border object-cover justify-center absolute right-0 bottom-0 lg:inline hidden text-ellipsis overflow-hidden">
            <img src={post.image} alt="post-image" className="object-contain" />
          </div>
        </Link>
      </div>
    </div>
  );
}
