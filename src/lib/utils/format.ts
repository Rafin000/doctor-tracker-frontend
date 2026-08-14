/** Human-friendly date, e.g. "14 Aug 2026". */
export function formatDate(value?: string | Date): string {
  if (!value) return '-'
  const d = new Date(value)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Initials for an avatar chip, e.g. "Dr. Arif Khan" -> "AK". */
export function initials(name: string): string {
  const parts = name.replace(/^Dr\.?\s*/i, '').trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

/** Title-cases a lowercase enum value, e.g. "male" -> "Male". */
export function titleCase(value?: string): string {
  if (!value) return '-'
  return value.charAt(0).toUpperCase() + value.slice(1)
}
