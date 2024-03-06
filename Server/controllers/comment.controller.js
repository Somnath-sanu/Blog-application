import { Comment } from "../models/comment.model.js";

//! CREATE COMMENT

export const createComment = async (req, res) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.userId) {
      return res
        .status(403)
        .json({ msg: "You are not allowed to create this comment" });
    }

    const newComment = await Comment.create({
      content,
      postId,
      userId,
    });

    res.status(200).json({ newComment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

//! GET ALL COMMENTS OF A PARTICULAR POST

export const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

//! LIKE COMMENT

export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    const userIndex = comment.likes.indexOf(req.userId); //! likes = Array
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.userId);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    //! since i changed the comment data , i have to save it

    await comment.save();
    // console.log(comment);
    res.status(200).json({ comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

//! EDIT COMMENT

export const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    // console.log(comment.userId.toString());
    // console.log(req.userId);

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comment.userId.toString() !== req.userId && !req.isAdmin) {
      return res
        .status(403)
        .json({ msg: "You are not allowed to edit this comment" });
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

//! DELETE COMMENT

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comment.userId.toString() !== req.userId && !req.isAdmin) {
      return res
        .status(403)
        .json({ msg: "You are not allowed to delete this comment" });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

//! GET COMMENTS FOR ADMIN DASHBOARD

export const getcomments = async (req, res) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ msg: "You are not allowed to get all comments" });
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
