import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import zod from "zod";

const updateSchema = zod.object({
  password: zod
    .string()
    .trim()
    .min(4, { message: "Password must be at least 4 characters" })

    .optional(),
  username: zod
    .string()
    .trim()
    .toLowerCase()
    .min(4, { message: "Username must be at least 4 characters" })
    .max(20, { message: "Username must be at most 20 characters" })
    .refine((value) => !value.includes(" "), {
      message: "Username cannot contain spaces",
    })
    .refine((value) => value === value.toLowerCase(), {
      message: "Username must be lowercase",
    })
    .refine((value) => /^[a-zA-Z0-9]+$/.test(value), {
      message: "Username can only contain letters and numbers",
    })
    .optional(),
  email: zod.string().email({ message: "Invalid email format" }).optional(),
  profilePicture: zod.string().url().optional(),
});

export const updateUser = async (req, res) => {
  const userId = req.userId;
  const id = req.params.userId;

  if (userId !== id) {
    return res
      .status(400)
      .json({ msg: "You are not allowed to update this user" });
  }

  const { success } = await updateSchema.safeParseAsync(req.body);

  if (!success) {
    return res.status(403).json({ msg: "Please fill inputs correctly" });
  }

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password, //! hashed password
        },
      },
      { new: true }
    );

    const { password, createdAt, updatedAt, __v, ...rest } = updatedUser._doc;
    return res.status(200).json(rest);
  } catch (error) {
    res.status(409).json({ msg: "Error Occured!!!", error });
  }
};

//! without { new: true } it will return previous value
//$set update the value that has been provided without disturbing others

export const deleteUser = async (req, res) => {
  if (req.userId !== req.params.userId) {
    return res
      .status(400)
      .json({ msg: "You are not allowed to update this user" });
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const signout = (req, res) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    console.log(error);
  }
};
