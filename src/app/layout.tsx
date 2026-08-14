import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import './globals.css'

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import { Providers } from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Doctor Tracker',
  description: 'Admin portal to manage doctors, patients and analytics.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={geistSans.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
