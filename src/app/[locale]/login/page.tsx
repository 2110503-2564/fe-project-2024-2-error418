"use client";

import { useActionState, useState } from "react";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { loginUser } from "@/db/auth";
import { useSearchParams } from "next/navigation";

export default function Register() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(loginUser, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  const enhancedAction = async (formData: FormData) => {
    formData.append("callbackUrl", window.location.href);
    return action(formData);
  };

  return (
    <main className="p-4">
      <div className="m-[20px] w-fit place-self-center rounded border border-[#927d2b] bg-[var(--primary)] p-[20px]">
        <h1 className="text-center text-2xl font-bold">Login</h1>
        <form className="flex flex-col items-center gap-4 py-4" action={enhancedAction}>
          <input type="hidden" name="returnTo" value={returnTo} />
          <TextField
            id="login-email"
            name="email"
            label="Email"
            variant="outlined"
            className="w-full rounded bg-[var(--inputbg)]"
            required
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="login-password">Password</InputLabel>
            <OutlinedInput
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="w-full bg-[var(--inputbg)]"
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "hide the password" : "display the password"}
                    onClick={() => setShowPassword((show) => !show)}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseUp={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ?
                      <EyeSlashIcon width={24} height={24} />
                    : <EyeIcon width={24} height={24} />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Button variant="contained" disabled={pending} type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </main>
  );
}
