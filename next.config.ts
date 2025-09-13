import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Do not fail production builds due to ESLint errors. This mirrors
    // Next.js' recommended `ignoreDuringBuilds` option when you want
    // CI/deployment to proceed even if lint warnings/errors exist.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
