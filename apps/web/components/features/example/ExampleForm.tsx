"use client";

import { Button } from "@/components/ui/Button";
import { FormSubmitError } from "@/components/ui/FormSubmitError";
import { RhfTextField } from "@/components/ui/react-hook-form/RhfTextField";
import ExampleService from "@/services/example/example.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { ExampleFormData } from "@omni-site/schemas";
import { createExampleSchema } from "@omni-site/schemas";
import { FormProvider, useForm } from "react-hook-form";

export function ExampleForm() {
  const create = ExampleService.createExample();
  const methods = useForm<ExampleFormData>({
    defaultValues: { name: "", email: "" },
    resolver: zodResolver(createExampleSchema),
    mode: "onBlur",
  });
  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  const onSubmit = (data: ExampleFormData) => {
    create.mutate({ data: data }, {
      onSuccess: () => reset(),
    });
  };

  const createdExample = create.data?.data;

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
              <FormSubmitError message={create.error?.response?.data?.message ?? create.error?.message} />
              {create.isSuccess && createdExample && (
                <Typography variant="body2" color="success.main">
                  Created: {createdExample.name} — {createdExample.email} (id:{" "}
                  {createdExample.id.slice(0, 8)}…)
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
