"use client";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { UserJSON } from "@/db/models/User";
import { getUserList } from "@/db/auth";
import { useDebouncedCallback } from "use-debounce";

export default function UserSearch({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly UserJSON[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleChange = useDebouncedCallback((email: string) => {
    setEmail(email);
    (async () => {
      setLoading(true);
      const users = await getUserList(
        { email: { $regex: email } },
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

  return (
    <Autocomplete
      sx={{ width: 300 }}
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
          label="Add Admin"
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
