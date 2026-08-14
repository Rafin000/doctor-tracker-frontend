'use client'

import {
  Avatar,
  Group,
  Menu,
  Text,
  UnstyledButton,
  rem,
} from '@mantine/core'
import { IconChevronDown, IconLogout } from '@tabler/icons-react'
import { useAuth } from '@/lib/hooks/use-auth'
import { initials } from '@/lib/utils/format'

export function UserMenu() {
  const { user, logout } = useAuth()
  if (!user) return null

  return (
    <Menu shadow="md" width={220} position="bottom-end">
      <Menu.Target>
        <UnstyledButton>
          <Group gap="xs">
            <Avatar color="brand" radius="xl" size={32}>
              {initials(user.name)}
            </Avatar>
            <Text size="sm" fw={500} visibleFrom="sm">
              {user.name}
            </Text>
            <IconChevronDown size={16} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{user.email}</Menu.Label>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<IconLogout style={{ width: rem(16) }} />}
          onClick={logout}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
