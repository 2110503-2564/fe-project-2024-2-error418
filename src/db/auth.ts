"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import User from "./models/User";
import dbConnect from "./dbConnect";

export async function authenticateUser(email: string, password: string) {
  await dbConnect();

  try {
    const user = await User.findOne({ email }).select("+password");
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

const RegisterForm = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).trim(),
  phone: z.string().trim(),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password length must be at least 6" }).trim(),
});

export async function registerUser(formState: unknown, formData: FormData) {
  try {
    const validatedFields = RegisterForm.safeParse({
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (validatedFields.success) {
      const { name, phone, email, password } = validatedFields.data;
      const user = await User.insertOne({ name, phone, email, password });
      if (user) {
        console.log(user);
        return { success: true };
      }
    } else {
      console.log("register failed");
      return { success: false, errors: validatedFields.error.flatten() };
    }
  } catch (err) {
    console.error(err);
  }
}

// function sendTokenResponse(user, statusCode, res) {
//   const token = user.getSignedJwtToken();
//   const options = {
//     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//   };
//   if (process.env == "production") {
//     options.secure = true;
//   }
//   res.status(statusCode).cookie("token", token, options).json({ success: true, token });
// }

// exports.register = async (req, res, next) => {
//   try {
//     const { name, phone, email, password } = req.body;
//     const user = await User.create({ name, phone, email, password });
//     sendTokenResponse(user, 200, res);
//   } catch (err) {
//     if (err.name == "ValidationError") {
//       res.status(400).json({ success: false, error: err.errors });
//     } else {
//       res.status(400).json({ success: false, message: "Some error occured" });
//       console.error(err);
//     }
//   }
// };

// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (email && password) {
//       const user = await User.findOne({ email }).select("+password");
//       if (user && (await user.matchPassword(password))) {
//         sendTokenResponse(user, 200, res);
//       } else {
//         res.status(401).json({ success: false, message: "Invalid credentials" });
//         console.warn("Invalid Credentials Login");
//       }
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Please provide an email and password",
//       });
//       console.info("Login Bad Request");
//     }
//   } catch (err) {
//     res.status(401).json({
//       success: false,
//       message: "Cannot convert email or password to string",
//     });
//     console.warn(err);
//   }
// };

// exports.getMe = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);
//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     res.status(400).json({ success: false });
//     console.error("Get Me Bad Request");
//   }
// };
