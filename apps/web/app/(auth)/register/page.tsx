"use client";

import { Button } from "@/components/ui/Button";
import { FormSubmitError } from "@/components/ui/FormSubmitError";
import { RhfTextField } from "@/components/ui/react-hook-form/RhfTextField";
import { api } from "@/lib/api/axios";
import { useLoginMutation } from "@/lib/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Card, CardContent, Link, Stack, Typography } from "@mui/material";
import type { RegisterFormData } from "@omni-site/schemas";
import { registerSchema } from "@omni-site/schemas";
import NextLink from "next/link";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function RegisterPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();
  const methods = useForm<RegisterFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });
  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      await api.post("/auth/register", data);
      loginMutation.mutate(
        { email: data.email, password: data.password },
        {
          onSuccess: () => window.location.assign("/"),
          onError: (err) => setApiError(err.message),
        }
      );
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const submitError = apiError ?? loginMutation.error?.message ?? null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Register
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create an account
          </Typography>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <RhfTextField<RegisterFormData>
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  autoComplete="email"
                />
                <RhfTextField<RegisterFormData>
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  autoComplete="new-password"
                />
                <FormSubmitError message={submitError} />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  loading={loginMutation.isPending || isSubmitting}
                >
                  Register
                </Button>
              </Stack>
            </form>
          </FormProvider>
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            Already have an account?{" "}
            <Link component={NextLink} href="/login">
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
