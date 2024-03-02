import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/middleware.js";

const router = Router();

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers",verifyToken,getUsers)
router.get("/:userId",getUser)
 
export default router;
