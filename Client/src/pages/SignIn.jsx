/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  initialPhase,
} from "../redux/user/userSlice";

import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import blog from "../assests/blog5.jpg";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignIn() {
  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  const { error, loading } = useSelector((state) => state.user);
  //! error : state.user.error , loading : state.user.loading
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialPhase());
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      // return setError("Password must be 4 or more characters long");
      return dispatch(
        signInFailure("Password must be 4 or more characters long")
      );
    }

    try {
      // setError(null);
      // setLoading(true);
      dispatch(signInStart());

      const { data } = await axios.post("/api/auth/signin", {
        ...formData,
      });

      // console.log(data);
      //! only on success = true , data will console , so if(data) {} will also woek same

      // if(data.success === false){
      //   return dispatch(signInFailure(data.message));
      // }
      //! this will work when u dont mention error status code in server
      //! axios is smart enough, error status code goes to catch

      if (data.success) {
        // console.log(data);
        // setLoading(false);
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      // if (error.response.data.message === "Fill all fields correctly") {
      //   setError("Please fill all the fields correctly");
      // }
      // if (error.response.data.message === "User not exists!!!") {
      //   setError("User does not exists !!");
      // }
      // if (error.response.data.message === "Incorrect Password!!") {
      //   setError("Incorrect Password!!");
      // }

      // setError(error.response.data.message);
      dispatch(signInFailure(error.response.data.message));
      // console.log("ERROR || HandleSubmit || ", error);
      // setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}

        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            {" "}
            <span className="flex gap-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 font-serif text-5xl">
              BL
              <img src={blog} alt="" className="w-11 rounded-full" />G
            </span>
          </Link>
          <p className="text-sm mt-5 font-mono"> </p>
        </div>

        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
                autoFocus
                required
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="*********"
                id="password"
                onChange={handleChange}
                required
                minLength="4"
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don&apos;t have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {error && (
            <Alert color="failure" className="mt-5">
              {" "}
              {error}{" "}
            </Alert>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignIn;

//! flex-1 : so that both left and right will take equal space

//! in normal button , the default type is submit , but here we have to add it type="submit"
