import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

function DashSidebar() {
  const [searchParams] = useSearchParams(); //! Array destructuring

  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

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
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>

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
