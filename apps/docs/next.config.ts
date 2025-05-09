import nextra from "nextra";

const withNextra = nextra({
  // ... Other Nextra config options
  search: false,
});

export default withNextra({
  // ... Other Next.js config options
  output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});
