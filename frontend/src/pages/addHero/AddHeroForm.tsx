import { useState } from 'react'
import {
  Box,
  Button,
  FileInput,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
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

function SharedFormFields({
  birthDate,
  memorialDate,
  gender,
  photo,
  error,
  isValid,
  loading,
  onBirthDateChange,
  onMemorialDateChange,
  onGenderChange,
  onPhotoChange,
}: SharedFormFieldsProps) {
  const { t } = useTranslation()
  return (
    <>
      <Group grow className={styles.formFieldShortContainer}>
        <TextInput
          label={t('addHeroForm.birthDate')}
          type="date"
          value={birthDate ? formatDateForInput(birthDate) : ''}
          onChange={(e) => onBirthDateChange(e.currentTarget.value ? new Date(e.currentTarget.value) : null)}
          className={`${styles.formField} ${styles.formFieldShort}`}
        />
        <TextInput
          label={t('addHeroForm.memorialDate')}
          type="date"
          value={memorialDate ? formatDateForInput(memorialDate) : ''}
          onChange={(e) => onMemorialDateChange(e.currentTarget.value ? new Date(e.currentTarget.value) : null)}
          className={`${styles.formField} ${styles.formFieldShort}`}
        />
      </Group>
      <Select
        label={t('addHeroForm.gender')}
        placeholder={t('addHeroForm.gender')}
        data={[
          { value: 'male', label: t('addHeroForm.male') },
          { value: 'female', label: t('addHeroForm.female') },
        ]}
        value={gender}
        onChange={onGenderChange}
        className={styles.formField}
      />
      <FileInput
        label={t('addHeroForm.photo')}
        placeholder={t('addHeroForm.photo')}
        accept="image/jpeg,image/png,image/webp,image/gif"
        value={photo}
        onChange={onPhotoChange}
        clearable
        className={styles.formField}
      />
      {error && <Text c="red" size="sm">{error}</Text>}
      <Button type="submit" disabled={!isValid || loading} loading={loading}>
        {t('addHeroForm.submit')}
      </Button>
    </>
  )
}

export interface AddHeroFormProps {
  onSuccess?: (soldier: Soldier) => void
}

export function AddHeroFormHebrew({ onSuccess }: AddHeroFormProps) {
  const { t } = useTranslation()
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
      setError(t('addHeroForm.error'))
    } finally {
      setLoading(false)
    }
  }

  const isValid = Boolean(nameHe.trim() && rankHe.trim() && unitHe.trim())

  return (
    <div className={styles.formCard} dir="rtl">
      <Title order={1} c="dark.8" className={styles.title}>
        {t('addHeroForm.titleHe')}
      </Title>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={t('addHeroForm.nameHe')}
            placeholder="e.g. איתי פריזט"
            value={nameHe}
            onChange={(e) => setNameHe(e.currentTarget.value)}
            required
            className={styles.formField}
          />
          <Group grow className={styles.formFieldShortContainer}>
            <TextInput
              label={t('addHeroForm.rankHe')}
              placeholder="e.g. סמל"
              value={rankHe}
              onChange={(e) => setRankHe(e.currentTarget.value)}
              required
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
            <TextInput
              label={t('addHeroForm.unitHe')}
              placeholder="e.g. גבעתי"
              value={unitHe}
              onChange={(e) => setUnitHe(e.currentTarget.value)}
              required
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
          </Group>
          <Textarea
            label={t('addHeroForm.captionHe')}
            placeholder={t('addHeroForm.captionHe')}
            value={captionHe}
            onChange={(e) => setCaptionHe(e.currentTarget.value)}
            minRows={3}
            className={styles.formField}
          />
          <SharedFormFields
            birthDate={birthDate}
            memorialDate={memorialDate}
            gender={gender}
            photo={photo}
            error={error}
            isValid={isValid}
            loading={loading}
            onBirthDateChange={setBirthDate}
            onMemorialDateChange={setMemorialDate}
            onGenderChange={setGender}
            onPhotoChange={setPhoto}
          />
        </Stack>
      </Box>
    </div>
  )
}

export function AddHeroFormEnglish({ onSuccess }: AddHeroFormProps) {
  const { t } = useTranslation()
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
      setError(t('addHeroForm.error'))
    } finally {
      setLoading(false)
    }
  }

  const isValid = Boolean(nameEn.trim() && rankEn.trim() && unitEn.trim())

  return (
    <div className={styles.formCard}>
      <Title order={1} c="dark.8" className={styles.title}>
        {t('addHeroForm.titleEn')}
      </Title>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={t('addHeroForm.nameEn')}
            placeholder="e.g. Itay Parizat"
            value={nameEn}
            onChange={(e) => setNameEn(e.currentTarget.value)}
            required
            className={styles.formField}
          />
          <Group grow className={styles.formFieldShortContainer}>
            <TextInput
              label={t('addHeroForm.rankEn')}
              placeholder="e.g. Sergeant"
              value={rankEn}
              onChange={(e) => setRankEn(e.currentTarget.value)}
              required
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
            <TextInput
              label={t('addHeroForm.unitEn')}
              placeholder="e.g. Givati"
              value={unitEn}
              onChange={(e) => setUnitEn(e.currentTarget.value)}
              required
              className={`${styles.formField} ${styles.formFieldShort}`}
            />
          </Group>
          <Textarea
            label={t('addHeroForm.captionEn')}
            placeholder={t('addHeroForm.captionEn')}
            value={captionEn}
            onChange={(e) => setCaptionEn(e.currentTarget.value)}
            minRows={3}
            className={styles.formField}
          />
          <SharedFormFields
            birthDate={birthDate}
            memorialDate={memorialDate}
            gender={gender}
            photo={photo}
            error={error}
            isValid={isValid}
            loading={loading}
            onBirthDateChange={setBirthDate}
            onMemorialDateChange={setMemorialDate}
            onGenderChange={setGender}
            onPhotoChange={setPhoto}
          />
        </Stack>
      </Box>
    </div>
  )
}
