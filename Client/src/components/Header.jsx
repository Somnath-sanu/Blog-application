/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation , useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import axios from "axios";
import { signoutSuccess } from "../redux/user/userSlice";
import { useState , useEffect } from "react";
import blog from "../assests/blog5.jpg"

function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation()

  const [searchParam] = useSearchParams()
  const navigate = useNavigate()
 

  // console.log(useSearchParams());
  // console.log(searchParam);
  // console.log(location.search); //?searchTerm=javascript
  // console.log(location.pathname); //?about //?projects

  // console.log(searchTerm); 
  //! kisi bhi page pe (?searchTerm=next) ye karne se log hota (next) thats why header mai use kara naki sirf search.jsx mai


  useEffect(() => {
    // const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl =searchParam.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const { data } = await axios.post("/api/user/signout");
      if (data) {
        // console.log(data);
        dispatch(signoutSuccess());
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const urlParams =  new URLSearchParams(location.search);
    // console.log(urlParams);
    
    searchParam.set('searchTerm', searchTerm);
    const searchQuery = searchParam.toString(); //! important else URLSearchParams {size: 1}
    // console.log(searchQuery); //? searchTerm=java
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        {" "}
        <span className="flex gap-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 font-serif text-xl drop-shadow-lg">
         BL
          <img src={blog} alt=""  className="w-8 rounded-full"/>
          GGY
        </span>
        
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              {" "}
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;

//! Two anchor tag are not allowed , thats why as={"div"}
