'use client'

import {
  Button,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { GENDER_OPTIONS } from '@/lib/constants'
import { PatientInput } from '@/lib/services/patient.service'
import { ApiError } from '@/lib/services/axios'
import { Gender, Patient } from '@/lib/types'

interface PatientFormModalProps {
  opened: boolean
  onClose: () => void
  patient?: Patient | null
  /** Parent supplies the create/update call; modal owns UX. */
  submit: (values: PatientInput) => Promise<unknown>
  title?: string
}

const EMPTY: PatientInput = {
  name: '',
  age: 0,
  gender: 'male',
  condition: '',
  phone: '',
  email: '',
}

export function PatientFormModal({
  opened,
  onClose,
  patient,
  submit,
  title,
}: PatientFormModalProps) {
  const [loading, setLoading] = useState(false)
  const editing = Boolean(patient)

  const form = useForm<PatientInput>({
    initialValues: EMPTY,
    validate: {
      name: (v) => (v.trim().length < 2 ? 'Name is required' : null),
      age: (v) => (v >= 0 && v <= 130 ? null : 'Enter a valid age'),
      condition: (v) =>
        v.trim().length < 2 ? 'Condition is required' : null,
    },
  })

  useEffect(() => {
    if (opened) {
      form.setValues(
        patient
          ? {
              name: patient.name,
              age: patient.age,
              gender: patient.gender,
              condition: patient.condition,
              phone: patient.phone || '',
              email: patient.email || '',
            }
          : EMPTY,
      )
      form.resetDirty()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, patient])

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true)
    try {
      // Drop empty optional fields so backend validation stays happy.
      const payload: PatientInput = {
        ...values,
        phone: values.phone || undefined,
        email: values.email || undefined,
      }
      await submit(payload)
      notifications.show({
        color: 'green',
        message: `Patient ${editing ? 'updated' : 'added'} successfully`,
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
      title={title ?? (editing ? 'Edit patient' : 'Add patient')}
      centered
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Full name"
            placeholder="John Doe"
            withAsterisk
            {...form.getInputProps('name')}
          />
          <Grid>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <NumberInput
                label="Age"
                min={0}
                max={130}
                withAsterisk
                {...form.getInputProps('age')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Select
                label="Gender"
                data={GENDER_OPTIONS}
                withAsterisk
                allowDeselect={false}
                {...form.getInputProps('gender')}
                onChange={(v) => form.setFieldValue('gender', v as Gender)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <TextInput
                label="Condition"
                placeholder="Hypertension"
                withAsterisk
                {...form.getInputProps('condition')}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Phone"
                placeholder="Optional"
                {...form.getInputProps('phone')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Email"
                placeholder="Optional"
                {...form.getInputProps('email')}
              />
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editing ? 'Save changes' : 'Add patient'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
