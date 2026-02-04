"use client";

import { Button } from "@/components/ui/Button";
import { RhfTextField } from "@/components/ui/react-hook-form/RhfTextField";
import AuthService from "@/services/auth/auth.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Card, CardContent, Link, Stack, Typography } from "@mui/material";
import type { RegisterFormData } from "@omni-site/schemas";
import { registerSchema } from "@omni-site/schemas";
import NextLink from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const registerMutation = AuthService.useRegisterMutation();
  const methods = useForm<RegisterFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });
  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: RegisterFormData) => {
    registerMutation.mutate({ data: data }, {
      onSuccess: () => {
        toast.success("Account created! Please sign in.");
        window.location.assign("/login");
      },
      onError: (err) => toast.error(err?.response?.data?.message ?? err?.message ?? "Registration failed")
    });
  };

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
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  loading={registerMutation.isPending || isSubmitting}
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
