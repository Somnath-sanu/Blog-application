import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import axios from "axios";

function SignIn() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null);
      setLoading(true);

      const { data } = await axios.post("/api/auth/signin", {
        ...formData,
      });

      if (data.success) {
        console.log(data);
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      if (error.response.data.message === "Fill all fields correctly") {
        return setError("Please fill all the fields correctly");
      }
      if (error.response.data.message === "User not exists!!!") {
        return setError("User not exists !!");
      }
      if (error.response.data.message === "Incorrect Password!!") {
        return setError("Incorrect Password!!");
      }
      console.log("ERROR || HandleSubmit || ", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}

        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            {" "}
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Somnath&apos;s
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            {" "}
            Sign up to continue Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Ipsam, quisquam?
          </p>
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
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="*********"
                id="password"
                onChange={handleChange}
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
    </div>
  );
}

export default SignIn;

//! flex-1 : so that both left and right will take equal space

//! in normal button , the default type is submit , but here we have to add it type="submit"
