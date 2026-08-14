'use client'

import { Card, Group, Text, ThemeIcon } from '@mantine/core'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  color?: string
}

export function StatCard({ label, value, icon, color = 'brand' }: StatCardProps) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" wrap="nowrap">
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {label}
          </Text>
          <Text fw={700} fz={30} lh={1.2} mt={6}>
            {value}
          </Text>
        </div>
        <ThemeIcon color={color} variant="light" size={52} radius="md">
          {icon}
        </ThemeIcon>
      </Group>
    </Card>
  )
}
