"use client";

import Typography from "@mui/material/Typography";

type FormSubmitErrorProps = {
  message: string | null | undefined;
};

export function FormSubmitError({ message }: FormSubmitErrorProps) {
  if (!message) return null;
  return (
    <Typography variant="body2" color="error">
      {message}
    </Typography>
  );
}
