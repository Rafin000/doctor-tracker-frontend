import { AppShellLayout } from '@/components/layout/app-shell-layout'

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShellLayout>{children}</AppShellLayout>
}
