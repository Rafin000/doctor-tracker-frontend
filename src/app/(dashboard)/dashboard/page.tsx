'use client'

import { AreaChart, BarChart, DonutChart } from '@mantine/charts'
import {
  Alert,
  Center,
  Grid,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core'
import {
  IconActivityHeartbeat,
  IconStethoscope,
  IconUsers,
} from '@tabler/icons-react'
import { PageHeader } from '@/components/common/page-header'
import { SectionCard } from '@/components/common/section-card'
import { StatCard } from '@/components/common/stat-card'
import { useDashboard } from '@/lib/hooks/use-dashboard'
import { titleCase } from '@/lib/utils/format'

const GENDER_COLORS: Record<string, string> = {
  male: 'blue.6',
  female: 'pink.5',
  other: 'gray.5',
}

export default function DashboardPage() {
  const { overview, isLoading, error } = useDashboard(30)

  if (error) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <Alert color="red" title="Could not load analytics">
          {error.message}
        </Alert>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of doctors, patients and recent activity."
      />

      {/* Stat tiles */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="lg">
        {isLoading || !overview ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} h={104} radius="md" />
          ))
        ) : (
          <>
            <StatCard
              label="Total Doctors"
              value={overview.totals.doctors}
              icon={<IconStethoscope size={26} />}
            />
            <StatCard
              label="Total Patients"
              value={overview.totals.patients}
              icon={<IconUsers size={26} />}
              color="teal"
            />
            <StatCard
              label="Avg Patients / Doctor"
              value={overview.totals.avgPatientsPerDoctor}
              icon={<IconActivityHeartbeat size={26} />}
              color="grape"
            />
          </>
        )}
      </SimpleGrid>

      <Grid gutter="lg">
        {/* Patients over time */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <SectionCard title="New patients (last 30 days)">
            {isLoading || !overview ? (
              <Skeleton h={280} radius="sm" />
            ) : overview.patientsOverTime.length === 0 ? (
              <EmptyChart />
            ) : (
              <AreaChart
                h={280}
                data={overview.patientsOverTime}
                dataKey="date"
                series={[{ name: 'count', label: 'Patients', color: 'brand.6' }]}
                curveType="monotone"
                withDots={false}
                withGradient
                tickLine="y"
              />
            )}
          </SectionCard>
        </Grid.Col>

        {/* Gender split */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <SectionCard title="Gender distribution">
            {isLoading || !overview ? (
              <Skeleton h={280} radius="sm" />
            ) : overview.genderDistribution.length === 0 ? (
              <EmptyChart />
            ) : (
              <Center h={280}>
                <DonutChart
                  size={180}
                  thickness={30}
                  withLabelsLine
                  withLabels
                  data={overview.genderDistribution.map((g) => ({
                    name: titleCase(g.gender),
                    value: g.count,
                    color: GENDER_COLORS[g.gender] ?? 'gray.5',
                  }))}
                />
              </Center>
            )}
          </SectionCard>
        </Grid.Col>

        {/* Patients per doctor */}
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <SectionCard title="Patients per doctor (top 10)">
            {isLoading || !overview ? (
              <Skeleton h={300} radius="sm" />
            ) : overview.patientsPerDoctor.length === 0 ? (
              <EmptyChart />
            ) : (
              <BarChart
                h={300}
                data={overview.patientsPerDoctor.map((d) => ({
                  doctor: d.doctor.replace(/^Dr\.?\s*/i, ''),
                  count: d.count,
                }))}
                dataKey="doctor"
                orientation="vertical"
                yAxisProps={{ width: 90 }}
                series={[{ name: 'count', label: 'Patients', color: 'brand.6' }]}
              />
            )}
          </SectionCard>
        </Grid.Col>

        {/* Conditions */}
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <SectionCard title="Top conditions">
            {isLoading || !overview ? (
              <Skeleton h={300} radius="sm" />
            ) : overview.patientsByCondition.length === 0 ? (
              <EmptyChart />
            ) : (
              <BarChart
                h={300}
                data={overview.patientsByCondition}
                dataKey="condition"
                series={[{ name: 'count', label: 'Patients', color: 'teal.6' }]}
              />
            )}
          </SectionCard>
        </Grid.Col>
      </Grid>
    </>
  )
}

function EmptyChart() {
  return (
    <Center h={280}>
      <Stack align="center" gap={4}>
        <Text c="dimmed" size="sm">
          No data yet
        </Text>
        <Text c="dimmed" size="xs">
          Add doctors and patients to see analytics.
        </Text>
      </Stack>
    </Center>
  )
}
