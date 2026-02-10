import { useEffect, useRef } from 'react'
import { Box, Paper, Text, Anchor, Group } from '@mantine/core'
import { IconPhone } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { API_URL } from '../../config'
import type { PayPalLink } from '../../types'
import styles from './DonationBox.module.css'

declare global {
  interface Window {
    paypal?: {
      DonationButton: (config: { env: string; hosted_button_id: string; container: string }) => { render: () => void }
    }
  }
}

interface DonationBoxProps {
  donationPhone: string | null
}

export function DonationBox({ donationPhone }: DonationBoxProps) {
  const { t } = useTranslation()
  const paypalRef = useRef<HTMLDivElement>(null)
  const { data: paypalLink } = useQuery<PayPalLink>({
    queryKey: ['paypal-link'],
    queryFn: () => fetch(`${API_URL}/donate/paypal-link`).then((r) => r.json()),
  })

  useEffect(() => {
    if (!paypalLink?.hosted_button_id || !paypalRef.current) return
    const id = paypalLink.hosted_button_id
    if (document.getElementById('paypal-donate-btn')) return
    const container = document.createElement('div')
    container.id = 'paypal-donate-btn'
    paypalRef.current.appendChild(container)
    const script = document.createElement('script')
    script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js'
    script.async = true
    script.onload = () => {
      if (window.paypal?.DonationButton) {
        window.paypal.DonationButton({
          env: 'sandbox',
          hosted_button_id: id,
          container: 'paypal-donate-btn',
        }).render()
      }
    }
    document.body.appendChild(script)
    return () => {
      const el = document.getElementById('paypal-donate-btn')
      if (el) el.innerHTML = ''
    }
  }, [paypalLink?.hosted_button_id])

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      withBorder
      className={styles.paper}
    >
      <Text fw={700} size="lg" c="dark.8" mb="md">
        {t('donate.title')}
      </Text>
      {donationPhone && (
        <Group mb="md" gap="sm">
          <IconPhone size={20} color="#b8962e" />
          <Text size="sm" fw={600}>
            {t('donate.phone_label')}:
          </Text>
          <Anchor href={`tel:${donationPhone}`} c="gold.7">
            {donationPhone}
          </Anchor>
        </Group>
      )}
      {paypalLink?.donate_url && !paypalLink.hosted_button_id && (
        <Anchor href={paypalLink.donate_url} target="_blank" rel="noopener noreferrer" c="gold.7" fw={600}>
          {t('donate.donate_button')}
        </Anchor>
      )}
      <Box ref={paypalRef} mt="sm" />
    </Paper>
  )
}
