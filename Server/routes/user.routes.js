import { Router } from "express";
import {
  deleteUser,
  signout,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/middleware.js";

const router = Router();

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);

export default router;
