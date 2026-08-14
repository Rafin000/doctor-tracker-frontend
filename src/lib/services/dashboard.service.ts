import { getData } from './axios'
import { DashboardOverview } from '../types'

export const DashboardService = {
  overview: (days = 30) =>
    getData<DashboardOverview>(`/dashboard/overview?days=${days}`),
}
