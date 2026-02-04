"use client";

import { useAuth } from "@/hooks/useAuth";
import { Box, CircularProgress, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GUEST_ONLY_PATHS = ["/login", "/register"];

function LoadingScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        gap: 2,
      }}
    >
      <CircularProgress size={32} />
      <Typography variant="body2" color="text.secondary">
        Loading…
      </Typography>
    </Box>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isGuestOnlyRoute = GUEST_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  useEffect(() => {
    if (isLoading) return;

    if (isGuestOnlyRoute) {
      if (user != null) {
        const from = searchParams.get("from");
        router.replace(from?.startsWith("/") ? from : "/");
      }
    } else {
      if (user == null) {
        router.replace(`/login?from=${encodeURIComponent(pathname ?? "/")}`);
      }
    }
  }, [isGuestOnlyRoute, user, isLoading, router, pathname, searchParams]);

  if (isLoading) return <LoadingScreen />;

  if (isGuestOnlyRoute && user != null) return null;
  if (!isGuestOnlyRoute && user == null) return null;

  return <>{children}</>;
}
