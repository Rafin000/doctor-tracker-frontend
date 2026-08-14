'use client'

import {
  ActionIcon,
  Avatar,
  Badge,
  Center,
  Group,
  Loader,
  Menu,
  Pagination,
  Table,
  Text,
} from '@mantine/core'
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react'
import { PaginationMeta, Patient } from '@/lib/types'
import { formatDate, initials, titleCase } from '@/lib/utils/format'

const GENDER_COLOR: Record<string, string> = {
  male: 'blue',
  female: 'pink',
  other: 'gray',
}

interface PatientsTableProps {
  patients: Patient[]
  isLoading: boolean
  meta?: PaginationMeta
  onPageChange: (page: number) => void
  onEdit?: (patient: Patient) => void
  onDelete: (patient: Patient) => void
  showDoctor?: boolean
  emptyText?: string
}

function doctorName(doctor: Patient['doctor']): string {
  if (doctor && typeof doctor === 'object') return doctor.name
  return '-'
}

export function PatientsTable({
  patients,
  isLoading,
  meta,
  onPageChange,
  onEdit,
  onDelete,
  showDoctor = true,
  emptyText = 'No patients found.',
}: PatientsTableProps) {
  const colSpan = showDoctor ? 7 : 6

  return (
    <>
      <Table.ScrollContainer minWidth={720}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Patient</Table.Th>
              <Table.Th>Age</Table.Th>
              <Table.Th>Gender</Table.Th>
              <Table.Th>Condition</Table.Th>
              {showDoctor && <Table.Th>Doctor</Table.Th>}
              <Table.Th>Registered</Table.Th>
              <Table.Th w={60} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={colSpan}>
                  <Center py="xl">
                    <Loader />
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : patients.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={colSpan}>
                  <Center py="xl">
                    <Text c="dimmed">{emptyText}</Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              patients.map((patient) => (
                <Table.Tr key={patient.id}>
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      <Avatar color="teal" radius="xl" size={36}>
                        {initials(patient.name)}
                      </Avatar>
                      <div>
                        <Text fw={500}>{patient.name}</Text>
                        {patient.email && (
                          <Text size="xs" c="dimmed">
                            {patient.email}
                          </Text>
                        )}
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>{patient.age}</Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={GENDER_COLOR[patient.gender] ?? 'gray'}
                    >
                      {titleCase(patient.gender)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="grape">
                      {patient.condition}
                    </Badge>
                  </Table.Td>
                  {showDoctor && <Table.Td>{doctorName(patient.doctor)}</Table.Td>}
                  <Table.Td>{formatDate(patient.createdAt)}</Table.Td>
                  <Table.Td>
                    <Menu shadow="md" position="bottom-end" withinPortal>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDotsVertical size={18} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {onEdit && (
                          <Menu.Item
                            leftSection={<IconEdit size={16} />}
                            onClick={() => onEdit(patient)}
                          >
                            Edit
                          </Menu.Item>
                        )}
                        <Menu.Item
                          color="red"
                          leftSection={<IconTrash size={16} />}
                          onClick={() => onDelete(patient)}
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
            {meta.total} patient{meta.total === 1 ? '' : 's'} &middot; page{' '}
            {meta.page} of {meta.totalPages}
          </Text>
          <Pagination
            value={meta.page}
            onChange={onPageChange}
            total={meta.totalPages}
            size="sm"
          />
        </Group>
      )}
    </>
  )
}
