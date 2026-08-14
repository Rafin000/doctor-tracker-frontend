'use client'

import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Menu,
  Pagination,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import {
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ConfirmModal } from '@/components/common/confirm-modal'
import { PageHeader } from '@/components/common/page-header'
import { DoctorFormModal } from '@/components/doctors/doctor-form-modal'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { useDoctorMutations, useDoctors } from '@/lib/hooks/use-doctors'
import { ApiError } from '@/lib/services/axios'
import { Doctor } from '@/lib/types'
import { formatDate, initials } from '@/lib/utils/format'

export default function DoctorsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [dates, setDates] = useState<[string | null, string | null]>([
    null,
    null,
  ])
  const debouncedSearch = useDebounce(search)
  const debouncedSpec = useDebounce(specialization)

  const query = useMemo(
    () => ({
      page,
      limit: 10,
      search: debouncedSearch || undefined,
      specialization: debouncedSpec || undefined,
      startDate: dates[0] || undefined,
      endDate: dates[1] || undefined,
    }),
    [page, debouncedSearch, debouncedSpec, dates],
  )

  const { doctors, meta, isLoading } = useDoctors(query)
  const { remove } = useDoctorMutations()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Doctor | null>(null)
  const [toDelete, setToDelete] = useState<Doctor | null>(null)
  const [deleting, setDeleting] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (doctor: Doctor) => {
    setEditing(doctor)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      const res = await remove(toDelete.id)
      notifications.show({
        color: 'green',
        message: `Doctor deleted (${res.removedPatients} patient(s) removed)`,
      })
      setToDelete(null)
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Delete failed',
        message: err instanceof ApiError ? err.message : 'Please try again',
      })
    } finally {
      setDeleting(false)
    }
  }

  const resetToFirstPage = () => setPage(1)

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Create, search and manage doctors and their patients."
        action={
          <Button leftSection={<IconPlus size={18} />} onClick={openCreate}>
            Add doctor
          </Button>
        }
      />

      <Card withBorder radius="md" mb="md" padding="md">
        <Group align="flex-end" gap="sm" wrap="wrap">
          <TextInput
            label="Search"
            placeholder="Name, specialization, hospital"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value)
              resetToFirstPage()
            }}
            w={260}
          />
          <TextInput
            label="Specialization"
            placeholder="e.g. Cardiology"
            value={specialization}
            onChange={(e) => {
              setSpecialization(e.currentTarget.value)
              resetToFirstPage()
            }}
            w={180}
          />
          <DatePickerInput
            type="range"
            label="Registered between"
            placeholder="Pick dates"
            value={dates}
            onChange={(val) => {
              setDates(val as [string | null, string | null])
              resetToFirstPage()
            }}
            clearable
            w={240}
          />
        </Group>
      </Card>

      <Card withBorder radius="md" padding={0}>
        <Table.ScrollContainer minWidth={760}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Doctor</Table.Th>
                <Table.Th>Specialization</Table.Th>
                <Table.Th>Hospital</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th>Registered</Table.Th>
                <Table.Th w={60} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Center py="xl">
                      <Loader />
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : doctors.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Center py="xl">
                      <Text c="dimmed">No doctors found.</Text>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : (
                doctors.map((doctor) => (
                  <Table.Tr key={doctor.id}>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <Avatar color="brand" radius="xl" size={36}>
                          {initials(doctor.name)}
                        </Avatar>
                        <Text fw={500}>{doctor.name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="brand">
                        {doctor.specialization}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{doctor.hospital}</Table.Td>
                    <Table.Td>
                      <Stack gap={0}>
                        <Text size="sm">{doctor.phone}</Text>
                        <Text size="xs" c="dimmed">
                          {doctor.email}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>{formatDate(doctor.createdAt)}</Table.Td>
                    <Table.Td>
                      <Menu shadow="md" position="bottom-end" withinPortal>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical size={18} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            component={Link}
                            href={`/doctors/${doctor.id}`}
                            leftSection={<IconUsers size={16} />}
                          >
                            View patients
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconEdit size={16} />}
                            onClick={() => openEdit(doctor)}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            onClick={() => setToDelete(doctor)}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {meta && meta.total > 0 && (
          <Group justify="space-between" p="md">
            <Text size="sm" c="dimmed">
              {meta.total} doctor{meta.total === 1 ? '' : 's'} &middot; page{' '}
              {meta.page} of {meta.totalPages}
            </Text>
            <Pagination
              value={meta.page}
              onChange={setPage}
              total={meta.totalPages}
              size="sm"
            />
          </Group>
        )}
      </Card>

      <DoctorFormModal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        doctor={editing}
      />
      <ConfirmModal
        opened={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete doctor"
        message={
          <>
            Delete <b>{toDelete?.name}</b>? All of this doctor&apos;s patients
            will also be removed. This cannot be undone.
          </>
        }
      />
    </>
  )
}
