import { Container, Title, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export function AddHeroPage() {
  const { t } = useTranslation()
  return (
    <Container size="sm" py="xl">
      <Title order={1} c="dark.8" mb="md">
        {t('nav.addHero')}
      </Title>
      <Text c="dimmed">
        Form to add a hero will be available here.
      </Text>
    </Container>
  )
}
