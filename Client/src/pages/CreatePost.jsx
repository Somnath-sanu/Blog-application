/* eslint-disable no-unused-vars */
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase/firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Failed !! Image size should be less than 5MB");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null);
    // console.log(Object.keys(formData));

    if (!Object.keys(formData).includes("title")) {
      return setPublishError("Please mention the Title");
    }

    if (!Object.keys(formData).includes("category")) {
      return setPublishError("Please select a Category");
    }
    if (formData?.category === "uncategorized") {
      return setPublishError("Please select a Category");
    }
    if (!Object.keys(formData).includes("image")) {
      return setPublishError("Please upload a image");
    }

    if (!Object.keys(formData).includes("content")) {
      return setPublishError("Content must be at least 100 words");
    }

    // console.log(formData.content.length);

    if (formData.content?.length < 50) {
      return setPublishError("Content must be at least 100 words");
    }

    try {
      
      const {data } = await axios.post("/api/post/create" , {
        ...formData
      })

      if(data){
        setPublishError(null);
        navigate(`/post/${data.slug}`);
        // console.log(data)
      }
      
    } catch (error) {
      console.log(error)
      if(error?.response?.data?.msg){
        return setPublishError(error.response.data.msg);
      }
      setPublishError("Something went wrong"); 
    }
  };

  // console.log(formData);
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            disabled={imageUploadProgress}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }

            disabled={imageUploadProgress}
            
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            required
            onChange={(e) => setFile(e.target.files[0])}
            disabled={imageUploadProgress}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData?.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-contain"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          minLength={50}
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
          
        />
        <Button type="submit" gradientDuoTone="purpleToPink" disabled={imageUploadProgress}>
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default CreatePost;
