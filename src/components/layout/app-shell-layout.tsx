'use client'

import {
  ActionIcon,
  AppShell,
  Box,
  Burger,
  Center,
  Group,
  Loader,
  NavLink,
  ScrollArea,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconActivity,
  IconLayoutDashboard,
  IconMoon,
  IconStethoscope,
  IconSun,
  IconUsers,
} from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { UserMenu } from './user-menu'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  { href: '/doctors', label: 'Doctors', icon: IconStethoscope },
  { href: '/patients', label: 'Patients', icon: IconUsers },
]

export function AppShellLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure()
  const pathname = usePathname()
  const router = useRouter()
  const { status, bootstrap } = useAuth()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  // Resolve session once, then guard.
  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status !== 'authenticated') {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    )
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <IconActivity size={26} color="var(--mantine-color-brand-6)" />
            <Title order={4} fw={700}>
              Doctor Tracker
            </Title>
          </Group>
          <Group gap="sm">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={toggleColorScheme}
              aria-label="Toggle color scheme"
            >
              {colorScheme === 'dark' ? (
                <IconSun size={18} />
              ) : (
                <IconMoon size={18} />
              )}
            </ActionIcon>
            <UserMenu />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <NavLink
                key={item.href}
                component={Link}
                href={item.href}
                label={item.label}
                leftSection={<item.icon size={20} />}
                active={active}
                variant="filled"
                mb={4}
                onClick={() => opened && toggle()}
              />
            )
          })}
        </AppShell.Section>
        <Box>
          <Text size="xs" c="dimmed" ta="center">
            Doctor Tracker v1.0
          </Text>
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
