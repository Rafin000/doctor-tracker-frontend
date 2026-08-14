'use client'

import useSWR from 'swr'
import { DashboardService } from '../services/dashboard.service'
import { QUERY_KEYS } from '../constants'

export function useDashboard(days = 30) {
  const { data, error, isLoading } = useSWR([QUERY_KEYS.DASHBOARD, days], () =>
    DashboardService.overview(days),
  )
  return { overview: data, isLoading, error }
}
