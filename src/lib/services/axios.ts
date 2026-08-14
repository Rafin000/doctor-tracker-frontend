import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { config } from '../config'
import { tokenStore } from '../auth/token'
import { ApiEnvelope } from '../types'

/** Backend error envelope shape. */
interface ErrorEnvelope {
  success: false
  statusCode: number
  message: string
  errorMessages?: string[]
}

export class ApiError extends Error {
  statusCode: number
  errors: string[]
  constructor(message: string, statusCode: number, errors: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
  }
}

/** Single axios instance for the whole app (Forward Flow services/Axios). */
export const API = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Attach the bearer token to every request.
API.interceptors.request.use((cfg) => {
  const token = tokenStore.get()
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`
  }
  return cfg
})

// On 401, drop the token and bounce to login (client-side only).
API.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ErrorEnvelope>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      tokenStore.clear()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(toApiError(error))
  },
)

function toApiError(error: AxiosError<ErrorEnvelope>): ApiError {
  const res = error.response?.data
  if (res) {
    return new ApiError(
      res.message || 'Request failed',
      res.statusCode || error.response?.status || 500,
      res.errorMessages || [],
    )
  }
  return new ApiError(error.message || 'Network error. Is the API reachable?', 0)
}

// ---- Typed helpers that unwrap the { data, meta } envelope ----

export async function getData<T>(
  url: string,
  cfg?: AxiosRequestConfig,
): Promise<T> {
  const res = await API.get<ApiEnvelope<T>>(url, cfg)
  return res.data.data
}

export async function getPage<T>(
  url: string,
  cfg?: AxiosRequestConfig,
): Promise<{ data: T[]; meta: ApiEnvelope<T[]>['meta'] }> {
  const res = await API.get<ApiEnvelope<T[]>>(url, cfg)
  return { data: res.data.data, meta: res.data.meta }
}

export async function postData<T>(url: string, body: unknown): Promise<T> {
  const res = await API.post<ApiEnvelope<T>>(url, body)
  return res.data.data
}

export async function patchData<T>(url: string, body: unknown): Promise<T> {
  const res = await API.patch<ApiEnvelope<T>>(url, body)
  return res.data.data
}

export async function deleteData<T>(url: string): Promise<T> {
  const res = await API.delete<ApiEnvelope<T>>(url)
  return res.data.data
}
