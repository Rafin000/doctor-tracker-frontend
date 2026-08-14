'use client'

import useSWR, { useSWRConfig } from 'swr'
import { DoctorService, DoctorInput } from '../services/doctor.service'
import { QUERY_KEYS } from '../constants'
import { DoctorQuery, PatientQuery } from '../types'

/** Revalidate any SWR key whose first segment matches one of `scopes`. */
function useRevalidate() {
  const { mutate } = useSWRConfig()
  return (scopes: string[]) =>
    mutate(
      (key) => Array.isArray(key) && scopes.includes(key[0] as string),
      undefined,
      { revalidate: true },
    )
}

export function useDoctors(query: DoctorQuery) {
  const { data, error, isLoading, isValidating } = useSWR(
    [QUERY_KEYS.DOCTORS, query],
    () => DoctorService.list(query),
    { keepPreviousData: true },
  )
  return {
    doctors: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isValidating,
    error,
  }
}

export function useDoctor(id?: string) {
  const { data, error, isLoading } = useSWR(
    id ? [QUERY_KEYS.DOCTOR, id] : null,
    () => DoctorService.get(id as string),
  )
  return { doctor: data, isLoading, error }
}

export function useDoctorPatients(id: string | undefined, query: PatientQuery) {
  const { data, error, isLoading, isValidating } = useSWR(
    id ? [QUERY_KEYS.DOCTOR_PATIENTS, id, query] : null,
    () => DoctorService.patients(id as string, query),
    { keepPreviousData: true },
  )
  return {
    patients: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isValidating,
    error,
  }
}

export function useDoctorMutations() {
  const revalidate = useRevalidate()

  return {
    create: async (payload: DoctorInput) => {
      const doctor = await DoctorService.create(payload)
      await revalidate([QUERY_KEYS.DOCTORS, QUERY_KEYS.DASHBOARD])
      return doctor
    },
    update: async (id: string, payload: Partial<DoctorInput>) => {
      const doctor = await DoctorService.update(id, payload)
      await revalidate([
        QUERY_KEYS.DOCTORS,
        QUERY_KEYS.DOCTOR,
        QUERY_KEYS.DASHBOARD,
      ])
      return doctor
    },
    remove: async (id: string) => {
      const res = await DoctorService.remove(id)
      await revalidate([
        QUERY_KEYS.DOCTORS,
        QUERY_KEYS.DASHBOARD,
        QUERY_KEYS.PATIENTS,
      ])
      return res
    },
    addPatient: async (id: string, payload: unknown) => {
      const patient = await DoctorService.addPatient(id, payload)
      await revalidate([
        QUERY_KEYS.DOCTOR_PATIENTS,
        QUERY_KEYS.PATIENTS,
        QUERY_KEYS.DASHBOARD,
      ])
      return patient
    },
    removePatient: async (id: string, patientId: string) => {
      const res = await DoctorService.removePatient(id, patientId)
      await revalidate([
        QUERY_KEYS.DOCTOR_PATIENTS,
        QUERY_KEYS.PATIENTS,
        QUERY_KEYS.DASHBOARD,
      ])
      return res
    },
  }
}
