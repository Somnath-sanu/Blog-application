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

  const { success, error } = await updateSchema.safeParseAsync(req.body);

  if (error) {
    return res.status(403).json({ msg: error.errors[0].message });
  }

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
    res.status(409).json({ msg: "Username or email already exists", error });
  }
};

//! without { new: true } it will return previous value
//$set update the value that has been provided without disturbing others

export const deleteUser = async (req, res) => {
  if (req.userId !== req.params.userId) {
    return res
      .status(400)
      .json({ msg: "You are not allowed to delete this user" });
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

export const getUsers = async (req, res) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ msg: "You are not allowed to see all users" });
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

   

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      // console.log(user._doc); // { all users documents }
      return rest;
    });

    

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    res.json(500).json({ error });
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.json(500).json({ error });
    console.log(error);
  }
};
