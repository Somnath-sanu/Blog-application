/* eslint-disable react/prop-types */
import moment from "moment";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import axios from "axios";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  // console.log(comment)
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`/api/user/${comment.userId}`);

        if (data) {
          
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    if (editedContent.length == 0) {
      return;
    }

    try {
      const { data } = await axios.put(
        `/api/comment/editComment/${comment._id}`,
        {
          content: editedContent,
        }
      );
      if (data) {
        // console.log(data);
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              autoFocus
              required
              rows="4"
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
                disabled={editedContent.length == 0 ? true : false}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-gray-700 pb-2 text-xl font-serif m-2 dark:text-white">
                {comment.content}
              </p>
              <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                <button
                  type="button"
                  onClick={() => onLike(comment._id)}
                  className={`text-gray-400 hover:text-blue-500 ${
                    currentUser &&
                    comment.likes?.includes(currentUser._id) &&
                    "!text-blue-500"
                  }`}
                >
                  <FaThumbsUp className="text-sm" />
                </button>
                <p className="text-gray-400">
                  {comment.numberOfLikes > 0 &&
                    comment.numberOfLikes +
                      " " +
                      (comment.numberOfLikes === 1 ? "like" : "likes")}
                </p>
              </div>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <div className="flex gap-3 justify-end m-auto">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-300 hover:text-blue-500 font-bold  tracking-wider"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-300 hover:text-red-500 font-bold  tracking-wider"
                    >
                      Delete
                    </button>
                  </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
