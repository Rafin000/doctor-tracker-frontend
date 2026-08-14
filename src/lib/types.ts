// ---- Response envelopes (match the NestJS backend) ----
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiEnvelope<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  meta?: PaginationMeta
}

export interface Paginated<T> {
  data: T[]
  meta: PaginationMeta
}

// ---- Domain models ----
export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}

export interface Doctor {
  id: string
  name: string
  specialization: string
  hospital: string
  phone: string
  email: string
  createdAt: string
  updatedAt: string
}

export type Gender = 'male' | 'female' | 'other'

export interface PatientDoctorSummary {
  id: string
  name: string
  specialization: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: Gender
  condition: string
  phone: string
  email: string
  doctor: PatientDoctorSummary | string | null
  createdAt: string
  updatedAt: string
}

// ---- Dashboard ----
export interface DashboardOverview {
  totals: {
    doctors: number
    patients: number
    avgPatientsPerDoctor: number
  }
  patientsPerDoctor: {
    doctorId: string
    doctor: string
    specialization: string
    count: number
  }[]
  patientsOverTime: { date: string; count: number }[]
  patientsByCondition: { condition: string; count: number }[]
  genderDistribution: { gender: string; count: number }[]
}

// ---- Query params ----
export interface ListQuery {
  page?: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface DoctorQuery extends ListQuery {
  specialization?: string
  hospital?: string
}

export interface PatientQuery extends ListQuery {
  condition?: string
  gender?: Gender
  doctorId?: string
}
