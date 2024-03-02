import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import postRoutes from "./post.routes.js";
import commentRoutes from "./comment.routes.js";
const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/post", postRoutes);
router.use("/comment", commentRoutes);

export default router;
