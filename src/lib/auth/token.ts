import Cookies from 'js-cookie'

// Stored in a cookie (not localStorage) so Next middleware can gate routes
// on the server before the protected page ever renders.
const TOKEN_KEY = 'dt_token'

export const tokenStore = {
  get: (): string | undefined => Cookies.get(TOKEN_KEY),
  set: (token: string) =>
    Cookies.set(TOKEN_KEY, token, {
      expires: 1, // days; mirrors JWT_EXPIRES_IN=1d
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }),
  clear: () => Cookies.remove(TOKEN_KEY),
}

export { TOKEN_KEY }
