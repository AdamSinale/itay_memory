import { useId } from 'react'
import styles from './FormSelect.module.css'

export interface FormSelectOption {
  value: string
  label: string
}

export type FormSelectVariant = 'form' | 'compact'

export interface FormSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: FormSelectOption[]
  /** First option with empty value (e.g. “All ranks”, “Select rank”). */
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  /** `form` matches Add Hero; `compact` matches filter forms next to Mantine inputs. */
  variant?: FormSelectVariant
}

export function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
  className,
  variant = 'form',
}: FormSelectProps) {
  const id = useId()
  const wrapClass =
    variant === 'compact'
      ? `${styles.wrap} ${styles.wrapCompact}`
      : `${styles.wrap} ${styles.wrapForm}`

  return (
    <div className={[wrapClass, className].filter(Boolean).join(' ')}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={styles.select}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange(e.currentTarget.value)}
      >
        {placeholder !== undefined && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
