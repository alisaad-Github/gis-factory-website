/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
    webpack(config) {
        config.resolve.alias["@"] = path.resolve(__dirname, "src");
        return config;
    },
    images: {
        minimumCacheTTL: 60,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 1024, 2048],
    },
    productionBrowserSourceMaps: true,
};

export default nextConfig;
