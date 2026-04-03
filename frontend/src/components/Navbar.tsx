import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Box, Container, Flex, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { LanguageToggle } from './LanguageToggle'
import styles from './Navbar.module.css'

function NavLink({
  to,
  label,
  isActive,
  className = '',
  onClick,
}: {
  to: string
  label: string
  isActive: boolean
  className?: string
  onClick?: () => void
}) {
  return (
    <UnstyledButton
      component={Link}
      to={to}
      onClick={onClick}
      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''} ${className}`.trim()}
    >
      {label}
    </UnstyledButton>
  )
}

export function AppNavbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [drawerOpened, { toggle, close }] = useDisclosure(false)
  const isHe = i18n.language === 'he'

  const navItems = [
    { to: '/', label: i18n.t('nav.home') },
    { to: '/search', label: i18n.t('nav.search') },
    { to: '/about', label: i18n.t('nav.about') },
    { to: '/add-hero', label: i18n.t('nav.addHero') },
  ]

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname === to
  }

  useEffect(() => {
    close()
  }, [location.pathname, close])

  useEffect(() => {
    if (!drawerOpened) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [drawerOpened, close])

  return (
    <Box component="header" className={styles.header}>
      <Container size="xl" h="100%">
        <Flex className={styles.navbarContainer}>
          <Flex
            component="nav"
            aria-label="Main"
            className={styles.navLinks}
          >
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                label={label}
                isActive={isActive(to)}
              />
            ))}
          </Flex>
          <button
            type="button"
            className={styles.menuToggle}
            onClick={toggle}
            aria-label={t('nav.openMenu')}
            aria-expanded={drawerOpened}
            data-opened={drawerOpened || undefined}
          >
            <span className={styles.menuToggleLine} />
            <span className={styles.menuToggleLine} />
            <span className={styles.menuToggleLine} />
          </button>
          {drawerOpened && (
            <>
              <button
                type="button"
                className={styles.mobileMenuBackdrop}
                onClick={close}
                aria-label={t('nav.closeMenu')}
              />
              <div
                className={`${styles.mobileMenuPanel} ${isHe ? styles.mobileMenuPanelEnd : styles.mobileMenuPanelStart}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-nav-title"
              >
                <div className={styles.mobileMenuHeader}>
                  <span id="mobile-nav-title" className={styles.mobileMenuTitle}>
                    {t('nav.menu')}
                  </span>
                  <button
                    type="button"
                    className={styles.mobileMenuClose}
                    onClick={close}
                    aria-label={t('nav.closeMenu')}
                  >
                    ×
                  </button>
                </div>
                <nav className={styles.mobileMenuNav} aria-label="Main">
                  {navItems.map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      label={label}
                      isActive={isActive(to)}
                      className={styles.mobileNavLink}
                      onClick={close}
                    />
                  ))}
                </nav>
              </div>
            </>
          )}
          <LanguageToggle />
        </Flex>
      </Container>
    </Box>
  )
}
