'use client'
import { DatePicker } from '@mantine/dates'
import { Box, Text, Group, Badge } from '@mantine/core'
import dayjs from 'dayjs'
import '@mantine/dates/styles.css'

// ── Simulated availability per service ───────────────────────────────────────
// In production these would come from a real API.
// Format: 'YYYY-MM-DD'

function generateBlockedDates(serviceId: string): string[] {
  const today = dayjs()
  const blocked: string[] = []

  // Deterministically block some dates based on serviceId hash
  const seed = serviceId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  for (let i = 0; i < 60; i++) {
    const date = today.add(i, 'day')
    // Block weekends for audio studio
    if (serviceId === 'audio-studio' && date.day() === 0) {
      blocked.push(date.format('YYYY-MM-DD'))
      continue
    }
    // Pseudo-random blocks based on seed
    if ((i * seed) % 7 === 0 || (i * seed) % 11 === 0) {
      blocked.push(date.format('YYYY-MM-DD'))
    }
  }
  return blocked
}

interface BookingCalendarProps {
  serviceId: string
  value: Date | null
  onChange: (date: Date | null) => void
  minDaysAhead?: number
}

export default function BookingCalendar({ serviceId, value, onChange, minDaysAhead = 1 }: BookingCalendarProps) {
  const blockedDates = generateBlockedDates(serviceId)
  const today = dayjs()
  const minDate = today.add(minDaysAhead, 'day').toDate()

  function isBlocked(date: Date) {
    return blockedDates.includes(dayjs(date).format('YYYY-MM-DD'))
  }

  function isDisabled(date: Date) {
    return dayjs(date).isBefore(minDate, 'day') || isBlocked(date)
  }

  return (
    <Box>
      <DatePicker
        value={value}
        onChange={onChange}
        minDate={minDate}
        excludeDate={isBlocked}
        getDayProps={(date) => {
          const blocked = isBlocked(date)
          const past = dayjs(date).isBefore(minDate, 'day')
          const selected = value && dayjs(date).isSame(dayjs(value), 'day')
          return {
            disabled: blocked || past,
            style: {
              background: selected
                ? 'var(--mantine-color-green-7)'
                : blocked
                ? '#FFF0F0'
                : past
                ? undefined
                : undefined,
              color: selected ? 'white' : blocked ? '#E03131' : undefined,
              borderRadius: 8,
              fontWeight: selected ? 700 : undefined,
            },
          }
        }}
        styles={{
          calendarHeader: { marginBottom: 8 },
          month: { width: '100%' },
          day: { borderRadius: 8, width: 36, height: 36 },
        }}
        style={{ width: '100%' }}
        size="md"
      />

      {/* Legend */}
      <Group gap="lg" mt="sm">
        <Group gap={6}>
          <Box style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--mantine-color-green-7)' }} />
          <Text fz="xs" c="var(--color-muted)">Selected</Text>
        </Group>
        <Group gap={6}>
          <Box style={{ width: 12, height: 12, borderRadius: 3, background: '#FFF0F0', border: '1px solid #FFB3B3' }} />
          <Text fz="xs" c="var(--color-muted)">Unavailable</Text>
        </Group>
        <Group gap={6}>
          <Box style={{ width: 12, height: 12, borderRadius: 3, background: 'white', border: '1px solid var(--color-border)' }} />
          <Text fz="xs" c="var(--color-muted)">Available</Text>
        </Group>
      </Group>

      {value && !isDisabled(value) && (
        <Badge mt="sm" size="md" radius="xl" variant="outline" style={{ borderColor: '#2F9E44', color: '#2F9E44' }}>
          ✓ {dayjs(value).format('ddd, D MMMM YYYY')}
        </Badge>
      )}
    </Box>
  )
}
