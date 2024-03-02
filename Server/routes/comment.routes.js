import { Router } from "express";
import { verifyToken } from "../middleware/middleware.js";
import {
  createComment,
  deleteComment,
  editComment,
  getPostComments,
  getcomments,
  likeComment,
} from "../controllers/comment.controller.js";
const router = Router();

router.post("/create", verifyToken, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);
router.get("/getComments", verifyToken, getcomments);

export default router;
