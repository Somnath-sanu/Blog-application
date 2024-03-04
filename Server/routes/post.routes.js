import { Router } from "express";
import {
  create,
  deletePost,
  getPosts,
  updatepost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/middleware.js";

const router = Router();

router.post("/create", verifyToken, create);
router.get("/getPosts", getPosts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletePost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);

export default router;
