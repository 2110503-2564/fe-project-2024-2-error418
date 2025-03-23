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

export default function Register() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(loginUser, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="p-4">
      <div className="place-self-center bg-[var(--primary)] m-[20px] p-[20px] w-fit rounded border border-[#927d2b]">
        <h1 className="text-center text-2xl font-bold">Login</h1>
        <form className="flex flex-col items-center gap-4 py-4" action={action}>
          <TextField id="login-email" name="email" label="Email" variant="outlined" className="bg-[var(--inputbg)] rounded w-full"/>
          <FormControl variant="outlined">
            <InputLabel htmlFor="login-password">Password</InputLabel>
            <OutlinedInput
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="bg-[var(--inputbg)] w-full"
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
