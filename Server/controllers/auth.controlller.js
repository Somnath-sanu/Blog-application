import { z } from "zod";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const signupSchema = z.object({
  username: z
    .string({ required_error: "username is required" })
    .min(4, { message: "Must be 4 or more characters long" })
    .trim(),
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "Invalid email address" })
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "password is required" })
    .min(4, { message: "Must be 4 or more characters long" }),
});

export const signup = async (req, res) => {
  try {
    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all fields correctly" });
    }
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists !!" });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    if (newUser) {
      return res
        .status(200)
        .json({ success: true, message: " User created successfully" });
    }
  } catch (error) {
    console.log("Error while creating user", error);
    return res.status(401).json({ success: false, error });
    // next(error);
  }
};

const signinSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "Invalid email address" })
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "password is required" })
    .min(4, { message: "Must be 4 or more characters long" }),
});
export const signin = async (req, res) => {
  const { success } = signinSchema.safeParse(req.body);

  if (!success) {
    return res
      .status(400)
      .json({ success: false, message: "Fill all fields correctly" });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exists!!!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Password!!" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);

    

    return res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({
        success: true,
        message: " User LoggedIn successfully",
        username: user.username,
        email: user.email,
        _id: user._id,
      });
  } catch (error) {
    console.log("Error logging :", error);
    res.status(500).json({ error });
  }
};

export const google = async (req, res) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = await User.create({
        username: name,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY);
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    console.log(error);
  }
};

//! 400 --> client error
//! 401 --> Unauthorized",indicates that a client request has not been completed.
/**
 * !Create a new document
 *! const user = new User(
  { 
    username,
    email,
    password
   });
*! user.save();

*! Update an existing document
const user = await User.findById('1234567890');
user.name = 'Jane Doe';
user.save();

*! Create a new document using the .create() method
const user = await User.create({ name: 'John Doe' });
 */
