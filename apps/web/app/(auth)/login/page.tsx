"use client";

import { Button } from "@/components/ui/Button";
import { FormSubmitError } from "@/components/ui/FormSubmitError";
import { RhfTextField } from "@/components/ui/react-hook-form/RhfTextField";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Card, CardContent, Link, Stack, Typography } from "@mui/material";
import type { LoginFormData } from "@omni-site/schemas";
import { loginSchema } from "@omni-site/schemas";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") ?? "/";
  const from = fromParam.startsWith("/") ? fromParam : "/";
  const { login, loginState } = useAuth();
  const methods = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });
  const { handleSubmit, formState: { isSubmitting } } = methods;

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
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            JWT + cookies + refresh tokens
          </Typography>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit((data) => login(data, { redirectTo: from }))}>
              <Stack spacing={2}>
                <RhfTextField<LoginFormData>
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  autoComplete="email"
                />
                <RhfTextField<LoginFormData>
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  autoComplete="current-password"
                />
                <FormSubmitError message={loginState.error?.message} />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  loading={loginState.isPending || isSubmitting}
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          </FormProvider>
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            No account?{" "}
            <Link component={NextLink} href="/register">
              Register
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
