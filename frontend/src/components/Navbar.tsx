import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Box, Container, Flex, UnstyledButton } from '@mantine/core'
import { LanguageToggle } from './LanguageToggle'
import styles from './Navbar.module.css'

function NavLink({
  to,
  label,
  isActive,
}: { to: string; label: string; isActive: boolean }) {
  return (
    <UnstyledButton
      component={Link}
      to={to}
      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()}
    >
      {label}
    </UnstyledButton>
  )
}

export function AppNavbar() {
  const { i18n } = useTranslation()
  const location = useLocation()
  const dir = i18n.language === 'he' ? 'rtl' : 'ltr'

  const navItems = [
    { to: '/', label: i18n.t('nav.home') },
    { to: '/about', label: i18n.t('nav.about') },
    { to: '/about#donate', label: i18n.t('nav.donate') },
    { to: '/add-hero', label: i18n.t('nav.addHero') },
  ]

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    if (to === '/about#donate') return location.pathname === '/about' && location.hash === '#donate'
    return location.pathname === to
  }

  return (
    <Box component="header" className={styles.header}>
      <Container size="xl" h="100%">
        <Flex
          h="100%"
          align="center"
          justify="space-between"
          gap="md"
          wrap="nowrap"
          direction={dir === 'rtl' ? 'row-reverse' : 'row'}
        >
          <Flex align="center" gap={4} className={styles.flexGrow} />
          <Flex align="center" gap={4} className={styles.flexShrink} role="navigation">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                label={label}
                isActive={to === '/about#donate' ? location.pathname === '/about' && location.hash === '#donate' : isActive(to)}
              />
            ))}
          </Flex>
          <Flex align="center" justify={dir === 'rtl' ? 'flex-start' : 'flex-end'} className={styles.flexGrow}>
            <LanguageToggle />
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
