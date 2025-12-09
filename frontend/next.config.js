/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        config.externals = config.externals || {};
        if (!isServer) {
            config.externals['debug'] = 'debug';
            config.externals['supports-color'] = 'supports-color';
        }
        return config;
    }
}

module.exports = nextConfig
