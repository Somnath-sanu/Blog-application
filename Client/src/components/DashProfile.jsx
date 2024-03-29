/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Alert, Button, TextInput, Spinner, Modal } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../Firebase/firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateFailure,
  updateSuccess,
  initialPhase,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutSuccess,
} from "../redux/user/userSlice.js";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fileRef = useRef();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.user);

  const toastOptions = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  };

  // console.log(imageUploadProgress, imageFileUploadError, imageFileUrl);
  // console.log(currentUser.profilePicture);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file)); //! generate a temprorary url
    }
  };

  // console.log(imageFile?.name)

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploadError(null);
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 5MB)"
        );
        setImageUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
          setImageUploadProgress(null);
        });
      }
    );
  };

  //! just to keep fileName unique added Date as user can select one image multiple times

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setUserUpdateSuccess(null);

    if (Object.keys(formData).length == 0) {
      return setError("No changes made!!!");
    }
    // if (formData.username?.includes(" ")) {
    //   return setError("Username cannot contain spaces");
    // }
    // if (!formData.username?.match(/^[a-zA-Z0-9]+$/)) {
    //   return setError("Username can only contain letters and numbers");
    // }

    // if (formData?.username?.length < 4 || formData?.username?.length > 20)
    //   return setError("Username must be between 4-20 characters long");

    // if (formData?.password?.length < 4)
    //   return setError("Password must be at least 4 characters");

    if (imageFileUploading) return;

    try {
      dispatch(updateStart());

      const { data } = await axios.put(`/api/user/update/${currentUser._id}`, {
        ...formData,
      });

      if (data) {
        // console.log(data);
        setError(null);
        setUserUpdateSuccess("User's profile updated successfully");
        toast.success("User's profile updated successfully", toastOptions);
        dispatch(updateSuccess(data));
      }
    } catch (error) {
      // console.log(error);

      // const {response} = error;
      // console.log(response);

      if (error.response.data.msg === "User is Unauthorised") {
        //!middleware error
        setError("User is Unauthorised");
        toast.warning("Please Log-in again :(", toastOptions);
        dispatch(updateFailure("User is Unauthorised"));
        handleSignout();
        // window.location.reload();
        return;
      }

      setError(error.response.data.msg);
      toast.error(error.response.data.msg, toastOptions);
      dispatch(updateFailure(error.response.data.msg));

      // if (error.response.status === 409) {
      //   setError("Username or email already exists");
      //   toast.error("Username or email already exists", toastOptions);
      //   dispatch(updateFailure("Username or email already exists"));
      //   return;
      // }

      // if (error.response.status === 403) {
      //   setError("Please fill all the inputs correctly");
      //   toast.error("Please fill all the inputs correctly", toastOptions);
      //   dispatch(updateFailure("Please fill all the inputs correctly"));
      //   return;
      // }
      // if (error.response.status === 400) {
      //   setError("You are not allowed to update this user");
      //   toast.error("You are not allowed to update this user", toastOptions);

      //   dispatch(updateFailure("You are not allowed to update this user"));
      //   return;
      // }
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    setError(null);

    try {
      dispatch(deleteUserStart());
      const { data } = await axios.delete(`api/user/delete/${currentUser._id}`);
      if (data) {
        // console.log(data);
        dispatch(deleteUserSuccess());
        window.location.reload();
      }
    } catch (error) {
      // console.log(error);

      if (error.response.data.msg === "User is Unauthorised") {
        dispatch(deleteUserFailure("User is Unauthorised"));
        handleSignout();
      }

      setError(error.response.data.msg);
      toast.error(error.response.data.msg, toastOptions);
      dispatch(updateFailure(error.response.data.msg));

      // if (error.response.data.msg === "User is Unauthorised") {
      //   setError("User is Unauthorised");
      //   toast.warning("Please Log-in again!!!", toastOptions);
      //   dispatch(deleteUserFailure("User is Unauthorised"));
      //   return;
      // } else {
      //   setError("You are not allowed to update this user");
      //   toast.error("Please Log-in again!!!", toastOptions);
      //   dispatch(deleteUserFailure("User is Unauthorised"));
      //   return;
      // }
    }
  };

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
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileRef}
          hidden
        />
        <div
          className=" relative w-32 h-32 self-center cursor-pointer shadow-md  overflow-hidden rounded-full"
          onClick={() => fileRef.current.click()}
        >
          {imageUploadProgress && (
            <CircularProgressbar
              value={imageUploadProgress || 0}
              text={`${imageUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(156, 217, 107, ${imageUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt=""
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageUploadProgress && imageUploadProgress < 100 && "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          required
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          required
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={imageFileUploading || loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Updating...</span>
            </>
          ) : (
            "Update"
          )}
        </Button>

        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              className="w-full"
              gradientDuoTone="purpleToPink"
            >
              Create a post
            </Button>
          </Link>
        )}

        {error && <Alert color="failure">{error}</Alert>}
        {userUpdateSuccess && (
          <Alert color="success">{userUpdateSuccess}</Alert>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          {" "}
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          {" "}
          Sign Out
        </span>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account? All of your posts
              and comments will also get deleted 🫢 Think Again !!!
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I&apos;m sure😎
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel🥹
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}
