import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mui/material", "@mui/material-nextjs", "@omni-site/schemas"],
};

export default nextConfig;
