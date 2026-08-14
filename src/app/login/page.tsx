'use client'

import {
  Box,
  Button,
  Card,
  Center,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconActivity } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { tokenStore } from '@/lib/auth/token'
import { useAuth } from '@/lib/hooks/use-auth'
import { ApiError } from '@/lib/services/axios'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tokenStore.get()) router.replace('/dashboard')
  }, [router])

  const form = useForm({
    initialValues: {
      email: 'admin@doctortracker.com',
      password: 'Admin@1234',
    },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Enter a valid email'),
      password: (v) => (v.length < 6 ? 'At least 6 characters' : null),
    },
  })

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true)
    try {
      await login(values.email, values.password)
      notifications.show({ color: 'green', message: 'Welcome back!' })
      router.replace('/dashboard')
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Login failed',
        message:
          err instanceof ApiError ? err.message : 'Something went wrong',
      })
    } finally {
      setLoading(false)
    }
  })

  return (
    <Center
      mih="100vh"
      p="md"
      style={{
        background:
          'linear-gradient(135deg, var(--mantine-color-brand-6) 0%, var(--mantine-color-brand-9) 100%)',
      }}
    >
      <Card w={410} maw="100%" withBorder shadow="xl" radius="lg" p="xl">
        <Stack gap="lg">
          <Group gap="sm">
            <ThemeIcon color="brand" variant="light" size={44} radius="md">
              <IconActivity size={26} />
            </ThemeIcon>
            <div>
              <Title order={3}>Doctor Tracker</Title>
              <Text size="sm" c="dimmed">
                Sign in to the admin portal
              </Text>
            </div>
          </Group>

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="admin@doctortracker.com"
                withAsterisk
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                withAsterisk
                {...form.getInputProps('password')}
              />
              <Button type="submit" fullWidth loading={loading} mt="xs">
                Sign in
              </Button>
            </Stack>
          </form>

          <Box
            p="xs"
            style={{
              borderRadius: 8,
              background: 'var(--mantine-color-gray-1)',
            }}
          >
            <Text size="xs" c="dimmed" ta="center">
              Demo login &middot; admin@doctortracker.com / Admin@1234
            </Text>
          </Box>
        </Stack>
      </Card>
    </Center>
  )
}
