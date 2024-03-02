/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";

import { Outlet, Navigate } from "react-router-dom";

function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return  <Outlet />;
}

export default OnlyAdminPrivateRoute;

//! An <Outlet> should be used in parent route elements to render their child route elements.
