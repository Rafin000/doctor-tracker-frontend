'use client'

import { Button, Grid, Group, Modal, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { useDoctorMutations } from '@/lib/hooks/use-doctors'
import { DoctorInput } from '@/lib/services/doctor.service'
import { ApiError } from '@/lib/services/axios'
import { Doctor } from '@/lib/types'

interface DoctorFormModalProps {
  opened: boolean
  onClose: () => void
  doctor?: Doctor | null
}

const EMPTY: DoctorInput = {
  name: '',
  specialization: '',
  hospital: '',
  phone: '',
  email: '',
}

export function DoctorFormModal({
  opened,
  onClose,
  doctor,
}: DoctorFormModalProps) {
  const { create, update } = useDoctorMutations()
  const [loading, setLoading] = useState(false)
  const editing = Boolean(doctor)

  const form = useForm<DoctorInput>({
    initialValues: EMPTY,
    validate: {
      name: (v) => (v.trim().length < 2 ? 'Name is required' : null),
      specialization: (v) =>
        v.trim().length < 2 ? 'Specialization is required' : null,
      hospital: (v) => (v.trim().length < 2 ? 'Hospital is required' : null),
      phone: (v) =>
        /^[+]?[\d\s-]{6,20}$/.test(v) ? null : 'Enter a valid phone number',
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Enter a valid email'),
    },
  })

  useEffect(() => {
    if (opened) {
      form.setValues(
        doctor
          ? {
              name: doctor.name,
              specialization: doctor.specialization,
              hospital: doctor.hospital,
              phone: doctor.phone,
              email: doctor.email,
            }
          : EMPTY,
      )
      form.resetDirty()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, doctor])

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true)
    try {
      if (editing && doctor) {
        await update(doctor.id, values)
      } else {
        await create(values)
      }
      notifications.show({
        color: 'green',
        message: `Doctor ${editing ? 'updated' : 'created'} successfully`,
      })
      onClose()
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Something went wrong',
        message: err instanceof ApiError ? err.message : 'Please try again',
      })
    } finally {
      setLoading(false)
    }
  })

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editing ? 'Edit doctor' : 'Add doctor'}
      centered
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Full name"
            placeholder="Dr. Jane Doe"
            withAsterisk
            {...form.getInputProps('name')}
          />
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Specialization"
                placeholder="Cardiology"
                withAsterisk
                {...form.getInputProps('specialization')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Hospital"
                placeholder="Square Hospital"
                withAsterisk
                {...form.getInputProps('hospital')}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Phone"
                placeholder="01700000000"
                withAsterisk
                {...form.getInputProps('phone')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Email"
                placeholder="jane@hospital.com"
                withAsterisk
                {...form.getInputProps('email')}
              />
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editing ? 'Save changes' : 'Create doctor'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
