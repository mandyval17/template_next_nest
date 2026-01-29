"use client";

import type { FieldPath, FieldValues } from "react-hook-form";
import { useController, useFormContext } from "react-hook-form";
import { Checkbox } from "../Checkbox";

export type RhfCheckboxProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: React.ReactNode;
  disabled?: boolean;
};

export function RhfCheckbox<T extends FieldValues>({
  name,
  label,
  disabled,
}: RhfCheckboxProps<T>) {
  const { control } = useFormContext<T>();
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController<T>({ name, control });

  return (
    <Checkbox
      checked={Boolean(value)}
      onChange={(v) => onChange(v)}
      onBlur={onBlur}
      inputRef={ref}
      label={label}
      disabled={disabled}
      error={!!error}
      helperText={error?.message}
    />
  );
}
