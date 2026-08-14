/**
 * Central SWR cache keys (Forward Flow `QUERY_KEYS` convention).
 * Hooks build keys as `[QUERY_KEYS.X, ...params]` so related caches are easy
 * to target for revalidation after a mutation.
 */
export const QUERY_KEYS = {
  AUTH_ME: 'auth-me',
  DOCTORS: 'doctors',
  DOCTOR: 'doctor',
  DOCTOR_PATIENTS: 'doctor-patients',
  PATIENTS: 'patients',
  PATIENT: 'patient',
  DASHBOARD: 'dashboard',
} as const

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export const PAGE_SIZE = 10
