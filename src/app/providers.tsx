'use client'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { SWRConfig } from 'swr'
import { theme } from '@/lib/theme'

/**
 * App-wide providers (Forward Flow App.tsx pattern):
 * MantineProvider (theme) + Notifications + global SWRConfig.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          dedupingInterval: 2000,
          errorRetryCount: 2,
          shouldRetryOnError: false,
        }}
      >
        {children}
      </SWRConfig>
    </MantineProvider>
  )
}
