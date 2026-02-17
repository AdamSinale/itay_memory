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

  const navItems = [
    { to: '/', label: i18n.t('nav.home') },
    { to: '/about', label: i18n.t('nav.about') },
    { to: '/add-hero', label: i18n.t('nav.addHero') },
  ]

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname === to
  }

  return (
    <Box component="header" className={styles.header}>
      <Container size="xl" h="100%">
        <Flex className={styles.navbarContainer}>
          <Flex role="navigation" className={styles.navLinks}>
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                label={label}
                isActive={isActive(to)}
              />
            ))}
          </Flex>
          <LanguageToggle />
        </Flex>
      </Container>
    </Box>
  )
}
