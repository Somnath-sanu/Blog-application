import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function DashSidebar() {
  const [searchParams] = useSearchParams(); //! Array destructuring

  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

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
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Link to={"/dashboard?tab=posts"}>
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              as={"div"}
            >
              Posts
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <>
              <Link to={"/dashboard?tab=users"}>
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as={"div"}
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;

//! Sidebar.item act as ancher tag and nesting of ancher tag is not allowed so as{"div"}
