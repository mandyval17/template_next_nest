"use client";

import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import MuiSwitch, { type SwitchProps } from "@mui/material/Switch";

export type SwitchComponentProps = Omit<SwitchProps, "checked" | "onChange"> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  error?: boolean;
  helperText?: string;
};

export function Switch({
  checked,
  onChange,
  label,
  onBlur,
  inputRef,
  error,
  helperText,
  ...switchProps
}: SwitchComponentProps) {
  const control = (
    <MuiSwitch
      {...switchProps}
      checked={checked}
      onChange={(_, v) => onChange(v)}
      onBlur={onBlur}
      inputRef={inputRef}
    />
  );
  const node = label != null ? (
    <FormControlLabel control={control} label={label} />
  ) : (
    control
  );
  if (helperText != null || error) {
    return (
      <Stack>
        {node}
        {helperText && (
          <FormHelperText error={error}>{helperText}</FormHelperText>
        )}
      </Stack>
    );
  }
  return node;
}
