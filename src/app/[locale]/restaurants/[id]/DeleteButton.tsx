"use client";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export default function DeleteButton({
  confirmText,
  deleteAction,
}: {
  confirmText: string;
  deleteAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [valid, setValid] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const btnText = useTranslations("Button")
  return (
    <>
      <Button size="small" onClick={handleClickOpen} color="error">
        {btnText("delete")}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              deleteAction();
              handleClose();
            },
          },
        }}
      >
        <DialogTitle>Are you sure to delete this?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To continue the deletion process please type
            <span className="font-bold">&nbsp;&quot;{confirmText}&quot;&nbsp;</span>below
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="confirmText"
            name="confirmText"
            label="Confirmation Text"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setValid(e.currentTarget.value == confirmText)}
          />
        </DialogContent>
        <DialogActions>
          <Button className="mt-1" type="submit" disabled={!valid}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
