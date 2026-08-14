'use client'

import {
  Alert,
  Anchor,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  IconArrowLeft,
  IconBuildingHospital,
  IconMail,
  IconPhone,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { ConfirmModal } from '@/components/common/confirm-modal'
import { PatientFormModal } from '@/components/patients/patient-form-modal'
import { PatientsTable } from '@/components/patients/patients-table'
import { useDebounce } from '@/lib/hooks/use-debounce'
import {
  useDoctor,
  useDoctorMutations,
  useDoctorPatients,
} from '@/lib/hooks/use-doctors'
import { ApiError } from '@/lib/services/axios'
import { Patient } from '@/lib/types'
import { initials } from '@/lib/utils/format'

export default function DoctorDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const { doctor, isLoading: doctorLoading, error } = useDoctor(id)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const query = useMemo(
    () => ({ page, limit: 10, search: debouncedSearch || undefined }),
    [page, debouncedSearch],
  )
  const { patients, meta, isLoading } = useDoctorPatients(id, query)
  const { addPatient, removePatient } = useDoctorMutations()

  const [formOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Patient | null>(null)
  const [deleting, setDeleting] = useState(false)

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await removePatient(id, toDelete.id)
      notifications.show({ color: 'green', message: 'Patient removed' })
      setToDelete(null)
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Remove failed',
        message: err instanceof ApiError ? err.message : 'Please try again',
      })
    } finally {
      setDeleting(false)
    }
  }

  if (error) {
    return (
      <Alert color="red" title="Doctor not found">
        {error.message}{' '}
        <Anchor component={Link} href="/doctors">
          Back to doctors
        </Anchor>
      </Alert>
    )
  }

  return (
    <>
      <Button
        component={Link}
        href="/doctors"
        variant="subtle"
        color="gray"
        leftSection={<IconArrowLeft size={16} />}
        mb="md"
        px={4}
      >
        Back to doctors
      </Button>

      {/* Doctor profile */}
      <Card withBorder radius="md" mb="lg" padding="lg">
        {doctorLoading || !doctor ? (
          <Skeleton h={80} />
        ) : (
          <Group justify="space-between" wrap="wrap">
            <Group gap="md" wrap="nowrap">
              <Avatar color="brand" radius="xl" size={64}>
                {initials(doctor.name)}
              </Avatar>
              <div>
                <Title order={3}>{doctor.name}</Title>
                <Badge variant="light" color="brand" mt={4}>
                  {doctor.specialization}
                </Badge>
              </div>
            </Group>
            <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="lg">
              <InfoItem
                icon={<IconBuildingHospital size={18} />}
                label="Hospital"
                value={doctor.hospital}
              />
              <InfoItem
                icon={<IconPhone size={18} />}
                label="Phone"
                value={doctor.phone}
              />
              <InfoItem
                icon={<IconMail size={18} />}
                label="Email"
                value={doctor.email}
              />
            </SimpleGrid>
          </Group>
        )}
      </Card>

      {/* Patients of this doctor */}
      <Group justify="space-between" mb="sm" wrap="wrap">
        <Title order={4}>Patients</Title>
        <Group gap="sm">
          <TextInput
            placeholder="Search patients"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value)
              setPage(1)
            }}
            w={220}
          />
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setFormOpen(true)}
          >
            Add patient
          </Button>
        </Group>
      </Group>

      <Card withBorder radius="md" padding={0}>
        <PatientsTable
          patients={patients}
          isLoading={isLoading}
          meta={meta}
          onPageChange={setPage}
          onDelete={setToDelete}
          showDoctor={false}
          emptyText="No patients under this doctor yet."
        />
      </Card>

      <PatientFormModal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        title="Add patient"
        submit={(values) => addPatient(id, values)}
      />
      <ConfirmModal
        opened={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Remove patient"
        message={
          <>
            Remove <b>{toDelete?.name}</b> from this doctor? This cannot be
            undone.
          </>
        }
      />
    </>
  )
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Group gap="xs" wrap="nowrap">
      <Text c="brand">{icon}</Text>
      <Stack gap={0}>
        <Text size="xs" c="dimmed">
          {label}
        </Text>
        <Text size="sm" fw={500}>
          {value}
        </Text>
      </Stack>
    </Group>
  )
}
