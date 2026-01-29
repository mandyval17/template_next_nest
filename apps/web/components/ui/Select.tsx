"use client";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect, { type SelectChangeEvent } from "@mui/material/Select";

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  required?: boolean;
  onBlur?: () => void;
  inputRef?: React.Ref<unknown>;
};

export function Select({
  value,
  onChange,
  options,
  label,
  placeholder,
  error,
  helperText,
  disabled,
  fullWidth,
  size = "medium",
  required,
  onBlur,
  inputRef,
}: SelectProps) {
  const handleChange = (e: SelectChangeEvent<string>) => onChange(e.target.value);

  return (
    <FormControl
      fullWidth={fullWidth}
      disabled={disabled}
      error={error}
      required={required}
      size={size}
    >
      {label && <InputLabel id={`select-${label}`}>{label}</InputLabel>}
      <MuiSelect
        labelId={label ? `select-${label}` : undefined}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        inputRef={inputRef}
        label={label}
        displayEmpty={!!placeholder}
        renderValue={(v) => {
          if (v === "" && placeholder) return placeholder;
          return options.find((o) => o.value === v)?.label ?? v;
        }}
      >
        {placeholder && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
