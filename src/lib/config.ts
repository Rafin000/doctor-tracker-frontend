/**
 * Central client config. The single place we read NEXT_PUBLIC_* env vars.
 * Vite/Next inline these at build time, so set them before building.
 */
export const config = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api',
}
