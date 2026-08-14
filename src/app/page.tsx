import { redirect } from 'next/navigation'

export default function Home() {
  // The dashboard layout guards the session and bounces to /login if needed.
  redirect('/dashboard')
}
