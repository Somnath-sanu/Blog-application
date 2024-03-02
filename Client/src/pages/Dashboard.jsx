/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp"

function Dashboard() {
  const location = useLocation();

  // console.log(location.search) //?tab=profile
  // console.log(location.pathname) //dashboard

  // console.log(useSearchParams())
  //! (2) [URLSearchParams, ƒ]
  //!  0 :  URLSearchParams {size: 1}
  //!  1 :  (nextInit, navigateOptions) => {…}

  const [searchParams] = useSearchParams(); //! Array destructuring

  // console.log(searchParams) // 0 : URLSearchParams {size: 1}
  // without using array(square bracket) .get method is not defined error

  const [tab, setTab] = useState("");

  useEffect(() => {
    //!----------------------------------------------------------------------------
    // const urlParams = new URLSearchParams(location.search);//! after ?tab=profile  : size 1 if ?tab=profile&icon=sun  : size 2
    // console.log(urlParams) //URLSearchParams {size: 1}
    // const tabFromUrl = urlParams.get("tab");
    // console.log(tabFromUrl); //profile

    //!--------------------------------------------------------------------------

    const tabFromUrl = searchParams.get("tab");
    //  console.log(tabFromUrl); //profile (if not NULL)
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* Profile... */}
      {tab === "profile" && <DashProfile />}
      {/* posts... */}
      {tab === "posts" && <DashPosts />}
      {/* users */}
      {tab === 'users' && <DashUsers/>}
      {/* comments  */}
      {tab === 'comments' && <DashComments/>}
      {/* dashboard comp */}
      {tab === 'dash' && <DashboardComp />}
    </div>

    //! Posts
  );
}

export default Dashboard;
