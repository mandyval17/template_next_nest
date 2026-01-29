"use client";

import { Button } from "@/components/ui/Button";
import { FormSubmitError } from "@/components/ui/FormSubmitError";
import { RhfTextField } from "@/components/ui/react-hook-form/RhfTextField";
import { useCreateExampleMutation } from "@/lib/services/example.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { ExampleFormData } from "@omni-site/schemas";
import { createExampleSchema } from "@omni-site/schemas";
import { FormProvider, useForm } from "react-hook-form";

export function ExampleForm() {
  const create = useCreateExampleMutation();
  const methods = useForm<ExampleFormData>({
    defaultValues: { name: "", email: "" },
    resolver: zodResolver(createExampleSchema),
    mode: "onBlur",
  });
  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  const onSubmit = (data: ExampleFormData) => {
    create.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <Card sx={{ flex: 1, maxWidth: 400 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Next + Nest + MUI + Zod
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          TanStack Query, axios, services
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <RhfTextField<ExampleFormData>
                name="name"
                label="Name"
                fullWidth
              />
              <RhfTextField<ExampleFormData>
                name="email"
                label="Email"
                type="email"
                fullWidth
              />
              <FormSubmitError message={create.error?.message} />
              {create.isSuccess && create.data && (
                <Typography variant="body2" color="success.main">
                  Created: {create.data.name} — {create.data.email} (id:{" "}
                  {create.data.id.slice(0, 8)}…)
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                loading={create.isPending || isSubmitting}
              >
                Submit (Zod + API)
              </Button>
            </Stack>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
