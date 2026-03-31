import { useState } from 'react'
import {
  Box,
  Button,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { createSoldier } from '../../api/http'
import type { Soldier } from '../../types'
import styles from './AddHeroPage.module.css'
import Dropzone from '../../components/Dropzone'
import { FormSelect } from '../../components/FormSelect'
import { RANK_OPTIONS } from '../../constants/ranks'

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
  photo: string | null
  error: string | null
  isValid: boolean
  loading: boolean
  onBirthDateChange: (date: Date | null) => void
  onMemorialDateChange: (date: Date | null) => void
  onGenderChange: (value: string | null) => void
  onPhotoChange: (url: string | null) => void
}

export interface AddHeroFormProps {
  isHebrew: boolean
  onSuccess?: (soldier: Soldier) => void
}

export function AddHeroForm({ isHebrew, onSuccess }: AddHeroFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name_he, setNameHe] = useState('')
  const [name_en, setNameEn] = useState('')
  const [rank, setRank] = useState('')
  const [unit, setUnit] = useState('')
  const [caption_en, setCaptionEn] = useState('')
  const [caption_he, setCaptionHe] = useState('')
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [memorialDate, setMemorialDate] = useState<Date | null>(null)
  const [gender, setGender] = useState<string>('זכר')
  const [photo, setPhoto] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData()
    formData.set('name_he', name_he.trim())
    formData.set('name_en', name_en.trim())
    formData.set('rank', rank.trim())
    formData.set('unit', unit.trim())
    if (caption_en.trim()) formData.set('caption_en', caption_en.trim())
    if (caption_he.trim()) formData.set('caption_he', caption_he.trim())
    if (birthDate) formData.set('birth_date', formatDateForInput(birthDate))
    if (memorialDate) formData.set('memorial_date', formatDateForInput(memorialDate))
    if (gender) formData.set('gender', gender)
    if (photo) formData.set('photo_url', photo)
    try {
      const soldier = await createSoldier(formData, isHebrew)
      onSuccess?.(soldier)
    } catch {
      setError(isHebrew ? 'שגיאה בהוספת הגיבור. נסה שוב.' : 'Failed to add hero. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isValid = Boolean(name_he.trim() && name_en.trim() && rank.trim() && unit.trim())

  return (
    <div className={styles.formCard}>
      <Title order={1} c="dark.8" className={styles.title}>
        {isHebrew ? 'הוסף גיבור' : 'Add your hero'}
      </Title>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack gap="md">
        <Group grow className={styles.formFieldShortContainer} dir="ltr">
          <TextInput
            label={'Hero\'s Name'}
            placeholder={'e.g. Itay Parizat'}
            value={name_en}
            onChange={(e) => setNameEn(e.currentTarget.value)}
            required
            className={`${styles.formField} ${styles.formFieldShort}`}
            />
          <TextInput
            label={'שם החלל'}
            placeholder={'e.g. איתי פריזט'}
            value={name_he}
            onChange={(e) => setNameHe(e.currentTarget.value)}
            required
            className={`${styles.formField} ${styles.formFieldShort} ${styles.hebrewInput}`}
          />
          </Group>
          <Group grow className={styles.formFieldShortContainer}>
            <FormSelect
              variant="form"
              className={styles.formFieldShort}
              label={isHebrew ? 'דרגה' : 'Rank'}
              value={rank}
              onChange={setRank}
              placeholder={isHebrew ? 'בחר דרגה' : 'Select rank'}
              required
              options={RANK_OPTIONS.map((r) => ({
                value: r.value,
                label: isHebrew ? r.labelHe : r.labelEn,
              }))}
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
            label={'Biography'}
            placeholder={'e.g. Biography'}
            value={caption_en}
            onChange={(e) => setCaptionEn(e.currentTarget.value)}
            minRows={3}
            className={`${styles.formField} ${styles.englishInput}`}
          />
          <Textarea
            label={'ביוגרפיה'}
            placeholder={'e.g. ביוגרפיה'}
            value={caption_he}
            onChange={(e) => setCaptionHe(e.currentTarget.value)}
            minRows={3}
            className={`${styles.formField} ${styles.hebrewInput}`}
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
              { label: isHebrew ? 'זכר' : 'Male', value: 'זכר' },
              { label: isHebrew ? 'נקבה' : 'Female', value: 'נקבה' },
            ]}
            value={gender ?? undefined}
            onChange={(value) => setGender(value)}
            className={styles.genderFormField}
          />
          <Dropzone className="p-16 mt-10 border border-neutral-200" onPhotoUrl={setPhoto} />
          {error && <Text c="red" size="sm">{error}</Text>}
          <Button type="submit" disabled={!isValid || loading} loading={loading} className={styles.submitFormButton}>
            {isHebrew ? 'הוסף חלל' : 'Add your hero'}
          </Button>
        </Stack>
      </Box>
    </div>
  )
}

