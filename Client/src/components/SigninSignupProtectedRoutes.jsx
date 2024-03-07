/* eslint-disable no-unused-vars */
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function SigninSignupProtectedRoutes() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Navigate to={"/dashboard?tab=profile"} /> : <Outlet />;
}

export default SigninSignupProtectedRoutes;
