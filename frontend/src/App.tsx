import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MantineProvider, AppShell } from '@mantine/core'
import { HomePage } from './pages/home/HomePage'
import { AboutPage } from './pages/about/AboutPage'
import { AddHeroPage } from './pages/addHero/AddHeroPage'
import SoldierPage from './pages/soldier/SoldierPage'
import { theme } from './theme'
import { AppNavbar } from './components/Navbar'

function App() {
  const { i18n } = useTranslation()
  const dir = i18n.language === 'he' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = i18n.language
  }, [i18n.language, dir])

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppShell
        header={{ height: 72 }}
        padding={0}
        classNames={{ main: 'app-shell-main' }}
      >
        <AppNavbar />
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/soldier/:id" element={<SoldierPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/add-hero" element={<AddHeroPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
    </MantineProvider>
  )
}

export default App
