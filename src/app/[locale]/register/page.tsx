"use client";

import { registerUser } from "@/db/auth";
import { useActionState } from "react";

export default function Register() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(registerUser, undefined);

  return (
    <form action={action}>
      <label htmlFor="register-name">
        Name:
        <input type="text" name="name" id="name" />
      </label>
      <label htmlFor="register-email">
        Email:
        <input type="text" name="email" id="email" />
      </label>
      <label htmlFor="register-phone">
        Phone:
        <input type="text" name="phone" id="phone" />
      </label>
      <label htmlFor="register-password">
        Password:
        <input type="password" name="password" id="password" />
      </label>
      <button type="submit" disabled={pending}>
        Submit
      </button>
    </form>
  );
}
