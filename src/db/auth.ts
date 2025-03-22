"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import User from "./models/User";
import dbConnect from "./dbConnect";
import { signIn, signOut } from "@/auth";

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
  const validatedFields = RegisterForm.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (validatedFields.success) {
    await dbConnect();
    const { name, phone, email, password } = validatedFields.data;
    const user = await User.insertOne({ name, phone, email, password });
    if (user) {
      await signIn("credentials", formData);
    }
  } else {
    console.log("register failed");
    return { success: false, errors: validatedFields.error.flatten() };
  }
  return { success: false };
}

export async function loginUser(formState: unknown, formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(`/login?error=${error.type}`);
    }
    throw error;
  }
}

export async function logoutUser() {
  await signOut();
}
