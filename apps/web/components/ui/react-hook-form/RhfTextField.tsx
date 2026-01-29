"use client";

import type { TextFieldProps } from "@mui/material/TextField";
import TextField from "@mui/material/TextField";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useController, useFormContext } from "react-hook-form";

export type RhfTextFieldProps<T extends FieldValues> = Omit<
  TextFieldProps,
  "name" | "value" | "onChange" | "onBlur" | "error" | "helperText"
> & {
  name: FieldPath<T>;
};

export function RhfTextField<T extends FieldValues>({
  name,
  ...textFieldProps
}: RhfTextFieldProps<T>) {
  const { control } = useFormContext<T>();
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController<T>({ name, control });

  return (
    <TextField
      {...textFieldProps}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ref}
      error={!!error}
      helperText={error?.message}
    />
  );
}
