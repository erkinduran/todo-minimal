import type {NextConfig} from "next";
import {fileURLToPath} from 'url';
import {join, dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
    output: "standalone",
    turbopack: {
        root: join(__dirname, '..'),
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            }, {
                protocol: 'https',
                hostname: 'tailwindcss.com',
                port: '',
                pathname: '/**',
            },
        ],
    }
};

export default nextConfig;
