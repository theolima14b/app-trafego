import SideMenu from './components/SideMenu'
import Header from './components/Header'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import About from './pages/About'
import UTMGenerator from './pages/UTMGenerator'
import CampaignAnalysis from './pages/CampaignAnalysis'
import CopyCreator from './pages/CopyCreator'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './contexts/AuthContext'

// Layout protegido: header + menu + área de conteúdo com Outlet
function ProtectedLayout() {
  return (
    <>
      <Header />
      <div className="flex items-stretch">
        <SideMenu />
        <main className="flex-1 p-8 ml-[220px] max-[900px]:ml-[180px] max-[640px]:ml-0 max-[640px]:p-4">
          <Outlet />
        </main>
      </div>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route path="/" element={<PrivateRoute><ProtectedLayout /></PrivateRoute>}>
            <Route index element={<Home />} />
            <Route path="campanhas">
              {/* Sub-rotas de Campanhas */}
              <Route index element={<UTMGenerator />} />
              <Route path="gerador-utm" element={<UTMGenerator />} />
              <Route path="analise-de-campanha" element={<CampaignAnalysis />} />
              <Route path="criador-de-copies" element={<CopyCreator />} />
            </Route>
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* Redireciona qualquer outra rota para home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
