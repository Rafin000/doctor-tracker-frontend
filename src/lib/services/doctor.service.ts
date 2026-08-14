import { deleteData, getData, getPage, patchData, postData } from './axios'
import { toQueryString } from './query-string'
import { Doctor, DoctorQuery, Patient, PatientQuery } from '../types'

export interface DoctorInput {
  name: string
  specialization: string
  hospital: string
  phone: string
  email: string
}

export const DoctorService = {
  list: (query: DoctorQuery = {}) =>
    getPage<Doctor>(`/doctors${toQueryString({ ...query })}`),

  get: (id: string) => getData<Doctor>(`/doctors/${id}`),

  create: (payload: DoctorInput) => postData<Doctor>('/doctors', payload),

  update: (id: string, payload: Partial<DoctorInput>) =>
    patchData<Doctor>(`/doctors/${id}`, payload),

  remove: (id: string) =>
    deleteData<{ id: string; removedPatients: number }>(`/doctors/${id}`),

  // Patients scoped to a doctor.
  patients: (id: string, query: PatientQuery = {}) =>
    getPage<Patient>(`/doctors/${id}/patients${toQueryString({ ...query })}`),

  addPatient: (id: string, payload: unknown) =>
    postData<Patient>(`/doctors/${id}/patients`, payload),

  removePatient: (id: string, patientId: string) =>
    deleteData<{ id: string }>(`/doctors/${id}/patients/${patientId}`),
}
