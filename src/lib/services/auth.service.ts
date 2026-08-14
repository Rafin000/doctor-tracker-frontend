import { getData, postData } from './axios'
import { AuthUser, LoginResponse } from '../types'

export const AuthService = {
  login: (payload: { email: string; password: string }) =>
    postData<LoginResponse>('/auth/login', payload),

  me: () => getData<AuthUser>('/auth/me'),
}
