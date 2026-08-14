'use client'

import useSWR, { useSWRConfig } from 'swr'
import { PatientService, PatientInput } from '../services/patient.service'
import { QUERY_KEYS } from '../constants'
import { PatientQuery } from '../types'

export function usePatients(query: PatientQuery) {
  const { data, error, isLoading, isValidating } = useSWR(
    [QUERY_KEYS.PATIENTS, query],
    () => PatientService.list(query),
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

export function usePatientMutations() {
  const { mutate } = useSWRConfig()
  const revalidate = (scopes: string[]) =>
    mutate(
      (key) => Array.isArray(key) && scopes.includes(key[0] as string),
      undefined,
      { revalidate: true },
    )

  return {
    update: async (id: string, payload: Partial<PatientInput>) => {
      const patient = await PatientService.update(id, payload)
      await revalidate([
        QUERY_KEYS.PATIENTS,
        QUERY_KEYS.DOCTOR_PATIENTS,
        QUERY_KEYS.DASHBOARD,
      ])
      return patient
    },
    remove: async (id: string) => {
      const res = await PatientService.remove(id)
      await revalidate([
        QUERY_KEYS.PATIENTS,
        QUERY_KEYS.DOCTOR_PATIENTS,
        QUERY_KEYS.DASHBOARD,
      ])
      return res
    },
  }
}
