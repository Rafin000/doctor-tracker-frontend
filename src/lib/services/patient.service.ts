import { deleteData, getData, getPage, patchData } from './axios'
import { toQueryString } from './query-string'
import { Gender, Patient, PatientQuery } from '../types'

export interface PatientInput {
  name: string
  age: number
  gender: Gender
  condition: string
  phone?: string
  email?: string
}

export const PatientService = {
  list: (query: PatientQuery = {}) =>
    getPage<Patient>(`/patients${toQueryString({ ...query })}`),

  get: (id: string) => getData<Patient>(`/patients/${id}`),

  update: (id: string, payload: Partial<PatientInput>) =>
    patchData<Patient>(`/patients/${id}`, payload),

  remove: (id: string) => deleteData<{ id: string }>(`/patients/${id}`),
}
