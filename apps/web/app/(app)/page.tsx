"use client";

import { ExampleForm } from "@/components/features/example/ExampleForm";
import { ExampleList } from "@/components/features/example/ExampleList";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  const { user, logout, logoutState, isLoading } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 720,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        {isLoading ? (
          <Typography variant="body2" color="text.secondary">
            Loading…
          </Typography>
        ) : user ? (
          <>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => logout()}
              loading={logoutState.isPending}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            component={Link}
            href="/login"
            variant="outlined"
            size="small"
          >
            Login
          </Button>
        )}
      </Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        sx={{ width: "100%", maxWidth: 720, flex: 1, alignItems: "center" }}
      >
        <ExampleForm />
        <ExampleList />
      </Stack>
    </Box>
  );
}
