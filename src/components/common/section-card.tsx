'use client'

import { Card, Group, Title } from '@mantine/core'

interface SectionCardProps {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <Card withBorder radius="md" padding="lg" h="100%">
      <Group justify="space-between" mb="md">
        <Title order={5}>{title}</Title>
        {action}
      </Group>
      {children}
    </Card>
  )
}
