/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";

function Search() {
  const [sidebarData, setSideBarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  });

  // console.log(sidebarData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const [searchParam] = useSearchParams();

  // console.log(searchParam); //?   URLSearchParams {size: 1}
  // console.log(searchParam.toString()); //? searchTerm=java

  // console.log(location); //? {pathname: '/search', search: '?searchTerm=java', hash: '', state: null, key: '6owf7p4z'}

  const navigate = useNavigate();

  useEffect(() => {
    const searchTermFromUrl = searchParam.get("searchTerm");
    const sortFromUrl = searchParam.get("sort");
    const categoryFromUrl = searchParam.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSideBarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

   

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = searchParam.toString();
        // console.log(searchQuery);

        const { data } = await axios.get(`/api/post/getPosts?${searchQuery}`);
        if (data) {
          // console.log(data);
          setLoading(false);
          setPosts(data.posts);
          if (data.posts.length === 4) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        setLoading(false);
        // console.log(error);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSideBarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "";
      setSideBarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    searchParam.set("searchTerm", sidebarData.searchTerm);
    searchParam.set("sort", sidebarData.sort);
    searchParam.set("category", sidebarData.category);
    const searchQuery = searchParam.toString(); //! important
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    searchParam.set("startIndex", startIndex);
    const searchQuery = searchParam.toString();

    try {
      const { data } = await axios.get(`/api/post/getPosts?${searchQuery}`);
      if (data) {
        // console.log(data);
        setPosts([...posts, ...data.posts]);
        // console.log(posts);
        if (data.posts.length === 4) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort || ""} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category || ""}
              id="category"
            >
              <option value="">Select a category</option>
              <option value="coding">Coding</option>
              <option value="science">Science and Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="fashion">Fashion</option>
              <option value="beauty">Beauty</option>
              <option value="travel">Travel</option>
              <option value="tech">Tech</option>
              <option value="health">Health and Fitness</option>
              <option value="food">Food and Recipe</option>
              <option value="education">Education</option>
              <option value="music">Music</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
