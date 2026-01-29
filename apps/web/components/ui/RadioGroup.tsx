"use client";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import MuiRadioGroup from "@mui/material/RadioGroup";

export type RadioGroupOption = { value: string; label: string };

export type RadioGroupProps = {
  value: string;
  onChange: (value: string) => void;
  options: RadioGroupOption[];
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  row?: boolean;
  required?: boolean;
  onBlur?: () => void;
};

export function RadioGroup({
  value,
  onChange,
  options,
  label,
  error,
  helperText,
  disabled,
  row,
  required,
  onBlur,
}: RadioGroupProps) {
  return (
    <FormControl component="fieldset" error={error} disabled={disabled} required={required}>
      {label && (
        <FormLabel component="legend" sx={{ mb: 0.5 }}>
          {label}
        </FormLabel>
      )}
      <MuiRadioGroup
        value={value}
        onChange={(_, v) => onChange(v)}
        onBlur={onBlur}
        row={row}
      >
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio />}
            label={opt.label}
          />
        ))}
      </MuiRadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
