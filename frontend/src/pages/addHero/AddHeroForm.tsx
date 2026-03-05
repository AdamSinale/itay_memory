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
  onSuccess?: (soldier: Soldier) => void
}

export function AddHeroFormHebrew({ onSuccess }: AddHeroFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameHe, setNameHe] = useState('')
  const [rankHe, setRankHe] = useState('')
  const [unitHe, setUnitHe] = useState('')
  const [captionHe, setCaptionHe] = useState('')
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [memorialDate, setMemorialDate] = useState<Date | null>(null)
  const [gender, setGender] = useState<string | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData()
    formData.set('name_he', nameHe.trim())
    formData.set('rank_he', rankHe.trim())
    formData.set('unit_he', unitHe.trim())
    if (captionHe.trim()) formData.set('caption_he', captionHe.trim())
    if (birthDate) formData.set('birth_date', formatDateForInput(birthDate))
    if (memorialDate) formData.set('memorial_date', formatDateForInput(memorialDate))
    if (gender) formData.set('gender', gender)
    if (photo) formData.set('photo', photo)
    try {
      const soldier = await createSoldier(formData)
      onSuccess?.(soldier)
    } catch {
      setError('שגיאה בהוספת הגיבור. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  const isValid = Boolean(nameHe.trim() && rankHe.trim() && unitHe.trim())

  return (
    <div className={styles.formCard} dir="rtl">
      <Title order={1} c="dark.8" className={styles.title}>
        {'הוסף גיבור'}
      </Title>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={'שם החלל'}
            placeholder="e.g. איתי פריזט"
            value={nameHe}
            onChange={(e) => setNameHe(e.currentTarget.value)}
            required
            className={styles.formField}
          />
          <Group grow className={styles.formFieldShortContainer}>
            <TextInput
              label={'דרגה'}
              placeholder="e.g. סמל"
              value={rankHe}
              onChange={(e) => setRankHe(e.currentTarget.value)}
              required
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
            <TextInput
              label={'יחידה'}
              placeholder="e.g. גבעתי"
              value={unitHe}
              onChange={(e) => setUnitHe(e.currentTarget.value)}
              required
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
          </Group>
          <Textarea
            label={'ביוגרפיה'}
            placeholder={'e.g. ביוגרפיה'}
            value={captionHe}
            onChange={(e) => setCaptionHe(e.currentTarget.value)}
            minRows={3}
            className={styles.formField}
          />
          <Group grow className={styles.formFieldShortContainer}>
            <TextInput
              label={'תאריך לידה'}
              type="date"
              value={birthDate ? formatDateForInput(birthDate) : ''}
              onChange={(e) => setBirthDate(e.currentTarget.value ? new Date(e.currentTarget.value) : null)}
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
            <TextInput
              label={'תאריך נפילה'}
              type="date"
              value={memorialDate ? formatDateForInput(memorialDate) : ''}
              onChange={(e) => setMemorialDate(e.currentTarget.value ? new Date(e.currentTarget.value) : null)}
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
          </Group>
          <SegmentedControl
            data={[
              { label: 'זכר', value: 'male' },
              { label: 'נקבה', value: 'female' },
            ]}
            value={gender ?? undefined}
            onChange={(value) => setGender(value)}
            className={styles.genderFormField}
          />
          <FileInput
            label={'תמונה'}
            placeholder={<IconUpload size={18} stroke={1.7} />}
            accept="image/jpeg,image/png,image/webp,image/gif"
            value={photo}
            onChange={setPhoto}
            clearable
            className={`${styles.formField} ${styles.uploadImageInput}`}
          />
          {error && <Text c="red" size="sm">{error}</Text>}
          <Button type="submit" disabled={!isValid || loading} loading={loading} className={styles.submitFormButton}>
            {'הוסף חלל'}
          </Button>
        </Stack>
      </Box>
    </div>
  )
}

export function AddHeroFormEnglish({ onSuccess }: AddHeroFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameEn, setNameEn] = useState('')
  const [rankEn, setRankEn] = useState('')
  const [unitEn, setUnitEn] = useState('')
  const [captionEn, setCaptionEn] = useState('')
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [memorialDate, setMemorialDate] = useState<Date | null>(null)
  const [gender, setGender] = useState<string | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData()
    formData.set('name_en', nameEn.trim())
    formData.set('rank_en', rankEn.trim())
    formData.set('unit_en', unitEn.trim())
    if (captionEn.trim()) formData.set('caption_en', captionEn.trim())
    if (birthDate) formData.set('birth_date', formatDateForInput(birthDate))
    if (memorialDate) formData.set('memorial_date', formatDateForInput(memorialDate))
    if (gender) formData.set('gender', gender)
    if (photo) formData.set('photo', photo)
    try {
      const soldier = await createSoldier(formData)
      onSuccess?.(soldier)
    } catch {
      setError('Failed to add hero. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isValid = Boolean(nameEn.trim() && rankEn.trim() && unitEn.trim())

  return (
    <div className={styles.formCard}>
      <Title order={1} c="dark.8" className={styles.title}>
        {'Add your hero'}
      </Title>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={'Hero\'s Name'}
            placeholder="e.g. Itay Parizat"
            value={nameEn}
            onChange={(e) => setNameEn(e.currentTarget.value)}
            required
            className={styles.formField}
          />
          <Group grow className={styles.formFieldShortContainer}>
            <TextInput
              label={'Rank'}
              placeholder="e.g. Sergeant"
              value={rankEn}
              onChange={(e) => setRankEn(e.currentTarget.value)}
              required
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
            <TextInput
              label={'Unit'}
              placeholder="e.g. Givati"
              value={unitEn}
              onChange={(e) => setUnitEn(e.currentTarget.value)}
              required
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
          </Group>
          <Textarea
            label={'Biography'}
            placeholder={'e.g. Biography'}
            value={captionEn}
            onChange={(e) => setCaptionEn(e.currentTarget.value)}
            minRows={3}
            className={styles.formField}
          />
          <Group grow className={styles.formFieldShortContainer}>
            <TextInput
              label={'Birth date'}
              type="date"
              value={birthDate ? formatDateForInput(birthDate) : ''}
              onChange={(e) => setBirthDate(e.currentTarget.value ? new Date(e.currentTarget.value) : null)}
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
            <TextInput
              label={'Memorial date'}
              type="date"
              value={memorialDate ? formatDateForInput(memorialDate) : ''}
              onChange={(e) => setMemorialDate(e.currentTarget.value ? new Date(e.currentTarget.value) : null)}
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
          </Group>
          <SegmentedControl
            data={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
            value={gender ?? undefined}
            onChange={(value) => setGender(value)}
            className={styles.genderFormField}
          />
          <FileInput
            label={'Photo'}
            placeholder={<IconUpload size={18} stroke={1.7} />}
            accept="image/jpeg,image/png,image/webp,image/gif"
            value={photo}
            onChange={setPhoto}
            clearable
            className={`${styles.formField} ${styles.uploadImageInput}`}
          />
          {error && <Text c="red" size="sm">{error}</Text>}
          <Button type="submit" disabled={!isValid || loading} loading={loading} className={styles.submitFormButton}>
            {'Add Hero'}
          </Button>
        </Stack>
      </Box>
    </div>
  )
}
