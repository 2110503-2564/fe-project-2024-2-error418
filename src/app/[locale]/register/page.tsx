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
import { registerUser } from "@/db/auth";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function Register() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(registerUser, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  const enhancedAction = async (formData: FormData) => {
    formData.append("callbackUrl", window.location.href);
    return action(formData);
  };

  const text = useTranslations("Signin");
  const btnText = useTranslations("Button");

  return (
    <main className="p-4">
      <div className="m-[20px] w-fit place-self-center rounded border border-[#927d2b] bg-[var(--primary)] p-[20px]">
        <h1 className="text-center text-2xl font-bold">{text("register")}</h1>
        <form className="flex flex-col items-center gap-4 py-4" action={enhancedAction}>
          <input type="hidden" name="returnTo" value={returnTo} />
          <TextField
            id="register-name"
            name="name"
            label={text("name")}
            variant="outlined"
            className="w-full rounded bg-[var(--inputbg)]"
            required
          />
          <TextField
            id="register-email"
            name="email"
            label={text("email")}
            variant="outlined"
            className="w-full rounded bg-[var(--inputbg)]"
            required
          />
          <TextField
            id="register-phone"
            name="phone"
            label={text("phone")}
            variant="outlined"
            className="w-full rounded bg-[var(--inputbg)]"
            required
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="register-password">{text("password")}</InputLabel>
            <OutlinedInput
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="w-full rounded bg-[var(--inputbg)]"
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "hide the password" : "display the password"}
                    onClick={() => {
                      setShowPassword((show) => !show);
                    }}
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
              label={text("password")}
            />
          </FormControl>
          <Button variant="contained" disabled={pending} type="submit" className="w-full">
            {btnText("submit")}
          </Button>
        </form>
      </div>
    </main>
  );
}
