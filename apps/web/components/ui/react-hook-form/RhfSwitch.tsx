"use client";

import type { FieldPath, FieldValues } from "react-hook-form";
import { useController, useFormContext } from "react-hook-form";
import { Switch } from "./Switch";

export type RhfSwitchProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: React.ReactNode;
  disabled?: boolean;
};

export function RhfSwitch<T extends FieldValues>({
  name,
  label,
  disabled,
}: RhfSwitchProps<T>) {
  const { control } = useFormContext<T>();
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController<T>({ name, control });

  return (
    <Switch
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
