'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Title, Text, TextInput, PasswordInput, Card, Stack, Group, Button, Switch, Anchor, SimpleGrid, Skeleton, Alert, Collapse } from '@mantine/core'
import { apiGetProfile, apiUpdateProfile, apiChangePassword, apiDeleteAccount, apiUpdateNotifications, ProfileData } from '@/lib/auth'
import { useAuthContext } from '@/context/AuthContext'

const EMPTY_PROFILE: ProfileData = { firstName: '', lastName: '', middleName: null, email: '', phone: '' }

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  type NotificationKey = 'billing' | 'team' | 'apps' | 'marketing'
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({ billing: true, team: true, apps: false, marketing: false })

  const handleNotificationToggle = async (key: 'billing' | 'apps' | 'marketing', checked: boolean) => {
    setNotifications(p => ({ ...p, [key]: checked }))
    try {
      await apiUpdateNotifications({ [key]: checked })
    } catch {
      setNotifications(p => ({ ...p, [key]: !checked }))
    }
  }
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const router = useRouter()
  const { logout } = useAuthContext()

  const handleDeleteAccount = async () => {
    setDeleteError(null)
    setDeleteLoading(true)
    try {
      await apiDeleteAccount()
      await logout()
      router.replace('/auth/login')
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete account.')
      setDeleteLoading(false)
    }
  }
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError(null)
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }
    setPwLoading(true)
    try {
      await apiChangePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword, confirmNewPassword: pwForm.confirmPassword })
      setPwSuccess(true)
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => { setPwSuccess(false); setShowChangePassword(false) }, 2500)
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : 'Failed to change password.')
    } finally {
      setPwLoading(false)
    }
  }

  useEffect(() => {
    apiGetProfile()
      .then(data => setProfile(data))
      .catch(err => setProfileError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setProfileLoading(false))
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateError(null)
    setUpdateSuccess(false)
    setUpdateLoading(true)
    try {
      const updated = await apiUpdateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        middleName: profile.middleName ?? '',
        email: profile.email,
        phone: profile.phone,
      })
      setProfile(updated)
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 2500)
    } catch (err: unknown) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setUpdateLoading(false)
    }
  }

  const inputStyles = { label: { fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }

  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }} maw={720}>
      <Stack gap={2} mb="xl">
        <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="var(--color-ink)">Settings</Title>
        <Text fz="sm" c="var(--color-muted)">Manage your account and preferences</Text>
      </Stack>

      {/* Profile */}
      <Section title="Profile" desc="Update your personal information">
        {profileLoading ? (
          <>
            <Group gap="md" mb="lg" pb="lg" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <Skeleton height={56} width={56} radius="xl" />
              <Box>
                <Skeleton height={14} width={140} radius="sm" mb={8} />
                <Skeleton height={10} width={80} radius="sm" />
              </Box>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={56} radius="xl" />
              ))}
            </SimpleGrid>
            <Skeleton height={40} width={140} radius="xl" mt="md" />
          </>
        ) : profileError ? (
          <Alert color="red" radius="md">{profileError}</Alert>
        ) : (
          <form onSubmit={handleProfileUpdate}>
            <Group gap="md" mb="lg" pb="lg" style={{ borderBottom: '1px solid var(--color-border)' }} wrap="wrap">
              <Box style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-gold-pale)', border: '2px solid rgba(201,146,10,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 20, color: 'var(--color-gold)', flexShrink: 0 }}>
                {`${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase()}
              </Box>
              <Box>
                <Text fz="sm" fw={600} c="var(--color-ink)">{profile.firstName} {profile.lastName}</Text>
                <Anchor fz="xs" c="var(--color-gold)" fw={600}>Change photo</Anchor>
              </Box>
            </Group>

            {updateError && <Alert color="red" radius="md" mb="md" withCloseButton onClose={() => setUpdateError(null)}>{updateError}</Alert>}

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
              <TextInput label="First Name" size="md" radius="xl" styles={inputStyles} required
                value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
              <TextInput label="Last Name" size="md" radius="xl" styles={inputStyles} required
                value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
              <TextInput label="Middle Name" size="md" radius="xl" styles={inputStyles}
                value={profile.middleName ?? ''} onChange={e => setProfile(p => ({ ...p, middleName: e.target.value }))} />
              <TextInput label="Phone Number" type="tel" size="md" radius="xl" styles={inputStyles} required
                value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
              <TextInput label="Email" type="email" size="md" radius="xl" styles={inputStyles} readOnly
                value={profile.email}
                styles={{ ...inputStyles, input: { background: 'var(--mantine-color-gray-0)', cursor: 'not-allowed' } }} />
            </SimpleGrid>

            <Group mt="md">
              <Button type="submit" radius="xl" size="md" loading={updateLoading}
                style={{ background: updateSuccess ? '#2F9E44' : 'var(--color-ink)', color: 'white', fontWeight: 700 }}>
                {updateSuccess ? '✓ Updated!' : 'Update profile'}
              </Button>
            </Group>
          </form>
        )}
      </Section>

      {/* Notifications */}
      <Section title="Notifications" desc="Choose what you want to be notified about">
        <Stack gap={0}>
          {([
            { key: 'billing',   label: 'Billing alerts',  desc: 'Renewals, failed payments and receipts' },
            // { key: 'team',      label: 'Team activity',   desc: 'New members, role changes and invites' },
            { key: 'apps',      label: 'App updates',     desc: 'Usage limits, errors and maintenance' },
            { key: 'marketing', label: 'News & offers',   desc: 'Product updates, tips and promos' },
          ] as { key: NotificationKey; label: string; desc: string }[]).map((n, i, arr) => (
            <Group key={n.key} justify="space-between" py="sm" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <Box style={{ flex: 1, paddingRight: 16 }}>
                <Text fz="sm" fw={500} c="var(--color-ink)">{n.label}</Text>
                <Text fz={11} c="var(--color-muted)" mt={2}>{n.desc}</Text>
              </Box>
              <Switch
                checked={notifications[n.key]}
                onChange={e => n.key === 'billing' || n.key === 'apps' || n.key === 'marketing'
                  ? handleNotificationToggle(n.key, e.currentTarget?.checked)
                  : setNotifications(p => ({ ...p, [n.key]: e.currentTarget?.checked }))
                }
                color="var(--color-ink)" size="sm" />
            </Group>
          ))}
        </Stack>
      </Section>

      {/* Security */}
      <Section title="Security" desc="Manage your password and login settings">
        <Stack gap={0}>
          {/* Password row */}
          <Box>
            <Group justify="space-between" py="sm" wrap="wrap">
              <Box>
                <Text fz="sm" fw={500} c="var(--color-ink)">Password</Text>
                <Text fz={11} c="var(--color-muted)" mt={2}>
                  {pwSuccess ? 'Password changed successfully' : 'Change your account password'}
                </Text>
              </Box>
              <Anchor fz="xs" fw={600} c="var(--color-gold)"
                onClick={() => { setShowChangePassword(v => !v); setPwError(null) }}>
                {showChangePassword ? 'Cancel' : 'Change'}
              </Anchor>
            </Group>
            <Collapse in={showChangePassword}>
              <form onSubmit={handleChangePassword}>
                <Stack gap="sm" pb="md">
                  {pwError && <Alert color="red" radius="md" withCloseButton onClose={() => setPwError(null)}>{pwError}</Alert>}
                  {pwSuccess && <Alert color="green" radius="md">Password changed successfully!</Alert>}
                  <PasswordInput label="Current password" size="md" radius="xl" required
                    styles={inputStyles} value={pwForm.currentPassword}
                    onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} />
                  <PasswordInput label="New password" size="md" radius="xl" required
                    styles={inputStyles} value={pwForm.newPassword}
                    onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} />
                  <PasswordInput label="Confirm new password" size="md" radius="xl" required
                    styles={inputStyles} value={pwForm.confirmPassword}
                    onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} />
                  <Group mt="xs">
                    <Button type="submit" radius="xl" size="sm" loading={pwLoading}
                      style={{ background: 'var(--color-ink)', color: 'white', fontWeight: 700 }}>
                      {pwLoading ? 'Saving...' : 'Save new password'}
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Collapse>
          </Box>

          {/* Two-factor authentication — disabled for now
          <Group justify="space-between" py="sm" style={{ borderBottom: '1px solid var(--color-border)' }} wrap="wrap">
            <Box>
              <Text fz="sm" fw={500} c="var(--color-ink)">Two-factor authentication</Text>
              <Text fz={11} c="var(--color-muted)" mt={2}>Add an extra layer of security</Text>
            </Box>
            <Anchor fz="xs" fw={500} c="var(--color-muted)">Enable</Anchor>
          </Group>
          */}

          {/* Active sessions — disabled for now
          <Group justify="space-between" py="sm" wrap="wrap">
            <Box>
              <Text fz="sm" fw={500} c="var(--color-ink)">Active sessions</Text>
              <Text fz={11} c="var(--color-muted)" mt={2}>2 devices currently signed in</Text>
            </Box>
            <Anchor fz="xs" fw={600} style={{ color: '#E03131' }}>Sign out all</Anchor>
          </Group>
          */}
        </Stack>
      </Section>

      {/* Danger */}
      <Section title="Danger Zone" desc="Irreversible and destructive actions">
        <Group justify="space-between" wrap="wrap" gap="sm">
          <Box>
            <Text fz="sm" fw={500} c="var(--color-ink)">Delete account</Text>
            <Text fz={11} c="var(--color-muted)" mt={2}>Permanently delete your account and all data</Text>
          </Box>
          {!deleteConfirm ? (
            <Button size="xs" radius="xl" variant="outline" onClick={() => setDeleteConfirm(true)}
              styles={{ root: { borderColor: '#FFC9C9', color: '#E03131' } }}>
              Delete account
            </Button>
          ) : (
            <Stack gap="xs" align="flex-end">
              {deleteError && <Alert color="red" radius="md" fz="xs">{deleteError}</Alert>}
              <Text fz="xs" c="var(--color-muted)">Are you sure? This cannot be undone.</Text>
              <Group gap="xs">
                <Button size="xs" radius="xl" variant="default" onClick={() => { setDeleteConfirm(false); setDeleteError(null) }}>
                  Cancel
                </Button>
                <Button size="xs" radius="xl" loading={deleteLoading} onClick={handleDeleteAccount}
                  style={{ background: '#E03131', color: 'white' }}>
                  Yes, delete my account
                </Button>
              </Group>
            </Stack>
          )}
        </Group>
      </Section>

    </Box>
  )
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p="lg" mb="md">
      <Box pb="md" mb="md" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <Text ff="var(--font-montserrat)" fw={700} fz={15} c="var(--color-ink)">{title}</Text>
        <Text fz="xs" c="var(--color-muted)" mt={2}>{desc}</Text>
      </Box>
      {children}
    </Card>
  )
}
