"use client";

import type { FieldPath, FieldValues } from "react-hook-form";
import { useController, useFormContext } from "react-hook-form";
import { RadioGroup as BaseRadioGroup, type RadioGroupOption } from "../RadioGroup";

export type RhfRadioGroupProps<T extends FieldValues> = {
  name: FieldPath<T>;
  options: RadioGroupOption[];
  label?: string;
  row?: boolean;
  disabled?: boolean;
  required?: boolean;
};

export function RhfRadioGroup<T extends FieldValues>({
  name,
  options,
  label,
  row,
  disabled,
  required,
}: RhfRadioGroupProps<T>) {
  const { control } = useFormContext<T>();
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController<T>({ name, control });

  return (
    <BaseRadioGroup
      value={String(value ?? "")}
      onChange={(v) => onChange(v)}
      onBlur={onBlur}
      options={options}
      label={label}
      row={row}
      disabled={disabled}
      required={required}
      error={!!error}
      helperText={error?.message}
    />
  );
}
