import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.js");

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

// next-intl still emits `experimental.turbo`; hoist it to the supported key.
function normalizeExperimental(config) {
  const experimental = config.experimental;
  if (experimental?.turbo) {
    const { turbo, ...rest } = experimental;
    config.experimental = {
      ...rest,
    };
    config.turbopack = {
      ...(config.turbopack ?? {}),
      ...turbo,
    };
  }
  return config;
}

export default normalizeExperimental(withNextIntl(nextConfig));
