/**
 * Central place to toggle experimental features while we iterate quickly.
 * Eventually this can be replaced by LaunchDarkly, Statsig, etc.
 */
export const featureFlags = {
  enableStripeSandbox: true,
  enableQrBeta: false,
  enableArabicOnboarding: true,
  mockDataMode: true,
};

export function isFeatureEnabled(flag) {
  return Boolean(featureFlags[flag]);
}
