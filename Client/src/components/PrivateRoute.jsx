import { useSelector } from "react-redux";

import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute;

//! An <Outlet> should be used in parent route elements to render their child route elements.
