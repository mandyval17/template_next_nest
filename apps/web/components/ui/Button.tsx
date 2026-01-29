"use client";

import MuiButton, { type ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export type ButtonComponentProps = ButtonProps & {
  loading?: boolean;
};

export function Button({
  loading = false,
  disabled,
  children,
  startIcon,
  ...rest
}: ButtonComponentProps) {
  return (
    <MuiButton
      {...rest}
      disabled={disabled ?? loading}
      startIcon={
        loading ? (
          <CircularProgress size={16} color="inherit" sx={{ mr: 0.5 }} />
        ) : (
          startIcon
        )
      }
    >
      {children}
    </MuiButton>
  );
}
