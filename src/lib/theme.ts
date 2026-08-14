import { createTheme, type MantineColorsTuple } from '@mantine/core'

// Single brand color used everywhere for a consistent palette.
const brand: MantineColorsTuple = [
  '#eef2ff',
  '#e0e7ff',
  '#c7d2fe',
  '#a5b4fc',
  '#818cf8',
  '#6366f1',
  '#4f46e5',
  '#4338ca',
  '#3730a3',
  '#312e81',
]

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: 6,
  colors: { brand },
  defaultRadius: 'md',
  fontFamily:
    'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
  headings: {
    fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
    fontWeight: '600',
  },
})
