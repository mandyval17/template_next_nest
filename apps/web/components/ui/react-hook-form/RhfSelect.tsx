"use client";

import type { FieldPath, FieldValues } from "react-hook-form";
import { useController, useFormContext } from "react-hook-form";
import { Select, type SelectOption } from "../Select";

export type RhfSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  required?: boolean;
};

export function RhfSelect<T extends FieldValues>({
  name,
  options,
  label,
  placeholder,
  fullWidth,
  size,
  required,
}: RhfSelectProps<T>) {
  const { control } = useFormContext<T>();
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController<T>({ name, control });

  return (
    <Select
      value={String(value ?? "")}
      onChange={(v) => onChange(v)}
      onBlur={onBlur}
      inputRef={ref}
      options={options}
      label={label}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size={size}
      required={required}
      error={!!error}
      helperText={error?.message}
    />
  );
}
