"use client";

import MuiCheckbox, { type CheckboxProps } from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";

export type CheckboxComponentProps = Omit<
  CheckboxProps,
  "checked" | "onChange"
> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  error?: boolean;
  helperText?: string;
};

export function Checkbox({
  checked,
  onChange,
  label,
  onBlur,
  inputRef,
  error,
  helperText,
  ...checkboxProps
}: CheckboxComponentProps) {
  const control = (
    <MuiCheckbox
      {...checkboxProps}
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
