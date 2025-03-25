"use client";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { UserJSON } from "@/db/models/User";
import { getUserList } from "@/db/auth";
import { useDebouncedCallback } from "use-debounce";
import { useTranslations } from "next-intl";

export default function UserSearch({
  name,
  data,
}: {
  name: string;
  data: { id: string; name: string; email: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly UserJSON[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleChange = useDebouncedCallback((email: string) => {
    setEmail(email);
    (async () => {
      setLoading(true);
      const users = await getUserList(
        { $and: [{ email: { $regex: email } }, { email: { $nin: data.map((e) => e.email) } }] },
        { sort: { name: 1 }, limit: 5 }
      );
      setLoading(false);
      setOptions(users.success ? users.data : []);
    })();
  }, 300);

  const handleOpen = () => {
    setOpen(true);
    handleChange(email);
  };

  const handleClose = () => {
    setOpen(false);
    setEmail("");
    setOptions([]);
  };

  const text = useTranslations("AddAdmin");
  return (
    <Autocomplete
      sx={{
        width: 300,
        "& .MuiAutocomplete-input": { color: "var(--text-primary)" },
        "& .MuiOutlinedInput-root": {
          backgroundColor: "var(--bg-secondary)",
          "& fieldset": { borderColor: "var(--border-color)" },
          "&:hover fieldset": { borderColor: "var(--border-color)" },
          "&.Mui-focused fieldset": { borderColor: "var(--accent-color)" },
        },
        "& .MuiInputLabel-root": { color: "var(--text-secondary) !important" },
        "& .MuiSvgIcon-root": { color: "var(--text-primary) !important" },
        "& .MuiAutocomplete-paper": {
          backgroundColor: "var(--bg-secondary) !important",
          color: "var(--text-primary) !important",
        },
        "& .MuiAutocomplete-listbox": {
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
        },
        "& .MuiAutocomplete-option:hover": { backgroundColor: "var(--accent-color)" },
      }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.email}
      options={options}
      loading={loading}
      filterOptions={(x) => x}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={text("placeholder")}
          onChange={(e) => {
            if (email != e.currentTarget.value) {
              handleChange(e.currentTarget.value);
            }
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ?
                    <CircularProgress color="inherit" size={20} />
                  : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
