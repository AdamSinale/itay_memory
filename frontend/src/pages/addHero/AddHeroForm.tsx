import { useState } from 'react'
import {
  Box,
  Button,
  FileInput,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { IconUpload } from '@tabler/icons-react'
import { createSoldier } from '../../api/http'
import type { Soldier } from '../../types'
import styles from './AddHeroPage.module.css'
import Dropzone from '../../components/Dropzone'

function formatDateForInput(d: Date | null): string {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export interface SharedFormFieldsProps {
  birthDate: Date | null
  memorialDate: Date | null
  gender: string | null
  photo: File | null
  error: string | null
  isValid: boolean
  loading: boolean
  onBirthDateChange: (date: Date | null) => void
  onMemorialDateChange: (date: Date | null) => void
  onGenderChange: (value: string | null) => void
  onPhotoChange: (file: File | null) => void
}

export interface AddHeroFormProps {
  isHebrew: boolean
  onSuccess?: (soldier: Soldier) => void
}

export function AddHeroForm({ isHebrew, onSuccess }: AddHeroFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [rank, setRank] = useState('')
  const [unit, setUnit] = useState('')
  const [caption, setCaption] = useState('')
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [memorialDate, setMemorialDate] = useState<Date | null>(null)
  const [gender, setGender] = useState<string>('male')
  const [photo, setPhoto] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData()
    formData.set('name', name.trim())
    formData.set('rank', rank.trim())
    formData.set('unit', unit.trim())
    if (caption.trim()) formData.set('caption', caption.trim())
    if (birthDate) formData.set('birth_date', formatDateForInput(birthDate))
    if (memorialDate) formData.set('memorial_date', formatDateForInput(memorialDate))
    if (gender) formData.set('gender', gender)
    if (photo) formData.set('photo', photo)
    try {
      const soldier = await createSoldier(formData, isHebrew)
      onSuccess?.(soldier)
    } catch {
      setError(isHebrew ? 'שגיאה בהוספת הגיבור. נסה שוב.' : 'Failed to add hero. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isValid = Boolean(name.trim() && rank.trim() && unit.trim())

  return (
    <div className={styles.formCard} dir="rtl">
      <Title order={1} c="dark.8" className={styles.title}>
        {isHebrew ? 'הוסף גיבור' : 'Add your hero'}
      </Title>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={isHebrew ? 'שם החלל' : 'Hero\'s Name'}
            placeholder={isHebrew ? 'e.g. איתי פריזט' : 'e.g. Itay Parizat'}
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
            className={styles.formField}
          />
          <Group grow className={styles.formFieldShortContainer}>
            <TextInput
              label={isHebrew ? 'דרגה' : 'Rank'}
              placeholder={isHebrew ? 'e.g. סמ"ר' : 'e.g. Sergeant'}
              value={rank}
              onChange={(e) => setRank(e.currentTarget.value)}
              required
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
            <TextInput
              label={isHebrew ? 'יחידה' : 'Unit'}
              placeholder={isHebrew ? 'e.g. גבעתי' : 'e.g. Givati'}
              value={unit}
              onChange={(e) => setUnit(e.currentTarget.value)}
              required
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
          </Group>
          <Textarea
            label={isHebrew ? 'ביוגרפיה' : 'Biography'}
            placeholder={isHebrew ? 'e.g. ביוגרפיה' : 'e.g. Biography'}
            value={caption}
            onChange={(e) => setCaption(e.currentTarget.value)}
            minRows={3}
            className={styles.formField}
          />
          <Group grow className={styles.formFieldShortContainer}>
            <TextInput
              label={isHebrew ? 'תאריך לידה' : 'Birth Date'}
              type="date"
              value={birthDate ? formatDateForInput(birthDate) : ''}
              onChange={(e) => setBirthDate(e.currentTarget.value ? new Date(e.currentTarget.value) : null)}
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
            <TextInput
              label={isHebrew ? 'תאריך נפילה' : 'Memorial Date'}
              type="date"
              value={memorialDate ? formatDateForInput(memorialDate) : ''}
              onChange={(e) => setMemorialDate(e.currentTarget.value ? new Date(e.currentTarget.value) : null)}
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
          </Group>
          <SegmentedControl
            data={[
              { label: isHebrew ? 'זכר' : 'Male', value: 'male' },
              { label: isHebrew ? 'נקבה' : 'Female', value: 'female' },
            ]}
            value={gender ?? undefined}
            onChange={(value) => setGender(value)}
            className={styles.genderFormField}
          />
          <Dropzone className='p-16 mt-10 border border-neutral-200' />
          {error && <Text c="red" size="sm">{error}</Text>}
          <Button type="submit" disabled={!isValid || loading} loading={loading} className={styles.submitFormButton}>
            {isHebrew ? 'הוסף חלל' : 'Add your hero'}
          </Button>
        </Stack>
      </Box>
    </div>
  )
}

