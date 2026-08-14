'use client'

import { Card, Group, TextInput, Select } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { IconSearch } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { ConfirmModal } from '@/components/common/confirm-modal'
import { PageHeader } from '@/components/common/page-header'
import { PatientFormModal } from '@/components/patients/patient-form-modal'
import { PatientsTable } from '@/components/patients/patients-table'
import { GENDER_OPTIONS } from '@/lib/constants'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { usePatientMutations, usePatients } from '@/lib/hooks/use-patients'
import { ApiError } from '@/lib/services/axios'
import { Gender, Patient } from '@/lib/types'

export default function PatientsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [condition, setCondition] = useState('')
  const [gender, setGender] = useState<Gender | null>(null)
  const [dates, setDates] = useState<[string | null, string | null]>([
    null,
    null,
  ])
  const debouncedSearch = useDebounce(search)
  const debouncedCondition = useDebounce(condition)

  const query = useMemo(
    () => ({
      page,
      limit: 10,
      search: debouncedSearch || undefined,
      condition: debouncedCondition || undefined,
      gender: gender || undefined,
      startDate: dates[0] || undefined,
      endDate: dates[1] || undefined,
    }),
    [page, debouncedSearch, debouncedCondition, gender, dates],
  )

  const { patients, meta, isLoading } = usePatients(query)
  const { update, remove } = usePatientMutations()

  const [editing, setEditing] = useState<Patient | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Patient | null>(null)
  const [deleting, setDeleting] = useState(false)

  const resetToFirstPage = () => setPage(1)

  const openEdit = (patient: Patient) => {
    setEditing(patient)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await remove(toDelete.id)
      notifications.show({ color: 'green', message: 'Patient deleted' })
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

  return (
    <>
      <PageHeader
        title="Patients"
        description="All patients across every doctor. Edit, filter and search."
      />

      <Card withBorder radius="md" mb="md" padding="md">
        <Group align="flex-end" gap="sm" wrap="wrap">
          <TextInput
            label="Search"
            placeholder="Name or condition"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value)
              resetToFirstPage()
            }}
            w={240}
          />
          <TextInput
            label="Condition"
            placeholder="e.g. Diabetes"
            value={condition}
            onChange={(e) => {
              setCondition(e.currentTarget.value)
              resetToFirstPage()
            }}
            w={180}
          />
          <Select
            label="Gender"
            placeholder="Any"
            data={GENDER_OPTIONS}
            value={gender}
            onChange={(v) => {
              setGender(v as Gender | null)
              resetToFirstPage()
            }}
            clearable
            w={140}
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
        <PatientsTable
          patients={patients}
          isLoading={isLoading}
          meta={meta}
          onPageChange={setPage}
          onEdit={openEdit}
          onDelete={setToDelete}
          showDoctor
        />
      </Card>

      <PatientFormModal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        patient={editing}
        submit={(values) => update((editing as Patient).id, values)}
      />
      <ConfirmModal
        opened={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete patient"
        message={
          <>
            Delete <b>{toDelete?.name}</b>? This cannot be undone.
          </>
        }
      />
    </>
  )
}
