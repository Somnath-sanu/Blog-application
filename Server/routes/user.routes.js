import { Router } from "express";

const router = Router()

router.get("/" , (req,res) => {
  res.send("API is working")
})

export default router ;