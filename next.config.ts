import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['dotted-map', 'proj4', '@turf/boolean-point-in-polygon'],
};

export default nextConfig;
