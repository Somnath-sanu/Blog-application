/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import OAuth from "../components/OAuth";
import {
  initialPhase,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import blog from "../assests/blog5.jpg";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

    if (formData.password.length < 4) {
      return setError("Password must be 4 or more characters long");
    }

    try {
      setError(null);
      setLoading(true);
      dispatch(signInStart());

      const { data } = await axios.post("/api/auth/signup", {
        ...formData,
      });

      if (data.success) {
        // console.log(data);
        setLoading(false);
        dispatch(signInSuccess(data));
        navigate("/dashboard?tab=profile");
      }
    } catch (error) {
      // console.log(error.response.data.message)
      // if (error.response.data.message === "Fill all fields correctly") {
      //   setError("Please fill all the fields correctly");
      // }
      // if (error.response.data.message === "User already exists !!") {
      //   setError("User already exists !!");
      // }
      setError(error.response.data.message);
      // console.log("ERROR || HandleSubmit || ", error);
      setLoading(false);
      dispatch(signInFailure(error.response.data.message));
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
          <p className="text-md mt-5 font-serif">
            {" "}
            Please sign up to create a post.
          </p>
        </div>

        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
                required
                autoFocus
                minLength="4"
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="name@company.com"
                placeholder="Email"
                id="email"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
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
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
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
    </div>
  );
}

export default SignUp;

//! flex-1 : so that both left and right will take equal space

//! in normal button , the default type is submit , but here we have to add it type="submit"
