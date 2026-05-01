'use client'
import { Box, Skeleton, SimpleGrid, Group, Stack } from '@mantine/core'

interface PageSkeletonProps {
  variant?: 'default' | 'list' | 'form'
}

export default function PageSkeleton({ variant = 'default' }: PageSkeletonProps) {
  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }}>
      {/* Page header */}
      <Group justify="space-between" mb="xl" wrap="nowrap">
        <Stack gap={6}>
          <Skeleton height={12} width={120} radius="sm" />
          <Skeleton height={28} width={220} radius="md" />
        </Stack>
        <Skeleton height={36} width={130} radius="xl" />
      </Group>

      {variant === 'default' && (
        <>
          {/* Stat cards row */}
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={120} radius="xl" />
            ))}
          </SimpleGrid>

          {/* Main content blocks */}
          <SimpleGrid cols={{ base: 1, xl: 3 }} spacing="md">
            <Box style={{ gridColumn: 'span 2' }}>
              <Skeleton height={300} radius="xl" mb="md" />
            </Box>
            <Skeleton height={300} radius="xl" />
          </SimpleGrid>
        </>
      )}

      {variant === 'list' && (
        <Stack gap="sm" maw={720}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={90} radius="xl" />
          ))}
        </Stack>
      )}

      {variant === 'form' && (
        <Stack gap="md" maw={640}>
          <Skeleton height={80} radius="xl" />
          <Skeleton height={56} radius="xl" />
          <Skeleton height={56} radius="xl" />
          <Skeleton height={56} radius="xl" />
          <Skeleton height={80} radius="xl" />
          <Skeleton height={42} width={160} radius="xl" />
        </Stack>
      )}
    </Box>
  )
}
