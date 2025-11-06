
import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SideMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [campanhasOpen, setCampanhasOpen] = useState(false)
  const location = useLocation()

  // Listener para abrir menu via evento customizado do header
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-mobile-menu', handler)
    return () => window.removeEventListener('open-mobile-menu', handler)
  }, [])

  // Fecha o menu ao clicar em um link ou overlay
  const handleClose = () => setOpen(false)

  // Abre automaticamente apenas quando estiver em subrotas de /campanhas
  useEffect(() => {
    setCampanhasOpen(location.pathname.startsWith('/campanhas/'))
  }, [location.pathname])

  const isCampanhasActive = location.pathname.startsWith('/campanhas')

  // Renderiza o menu lateral (drawer)
  const menuContent = (
    <nav className="flex flex-col h-full" aria-label="Main navigation">
      <ul className="list-none p-2 m-0 flex-1">
        <li>
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `block px-4 py-2.5 rounded-md no-underline transition-all ${
              isActive 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                : 'text-white/85 hover:bg-white/10'
            }`}
            onClick={handleClose}
          >
            Overview
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/campanhas"
            className={() => `flex justify-between items-center px-4 py-2.5 rounded-md no-underline transition-all ${
              isCampanhasActive 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                : 'text-white/85 hover:bg-white/10'
            }`}
            onClick={(e) => {
              e.preventDefault()
              setCampanhasOpen(prev => !prev)
            }}
            aria-expanded={campanhasOpen}
          >
            <span>Campanhas</span>
            <span className="text-xs opacity-70 transition-transform">{campanhasOpen ? '▲' : '▼'}</span>
          </NavLink>
          {campanhasOpen && (
            <ul className="list-none m-1 mt-1 mb-2 p-1 pt-1 border-l border-white/12">
              <li>
                <NavLink 
                  to="/campanhas/gerador-utm" 
                  className={({ isActive }) => `block pl-6 pr-4 py-2 rounded-md text-[0.95rem] no-underline transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'text-white/85 hover:bg-white/10'
                  }`}
                  onClick={handleClose}
                >
                  Gerador de UTM
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/campanhas/analise-de-campanha" 
                  className={({ isActive }) => `block pl-6 pr-4 py-2 rounded-md text-[0.95rem] no-underline transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'text-white/85 hover:bg-white/10'
                  }`}
                  onClick={handleClose}
                >
                  Análise de Campanha
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/campanhas/criador-de-copies" 
                  className={({ isActive }) => `block pl-6 pr-4 py-2 rounded-md text-[0.95rem] no-underline transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'text-white/85 hover:bg-white/10'
                  }`}
                  onClick={handleClose}
                >
                  Criador de Copies
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        
        <li>
          <NavLink 
            to="/crm" 
            className={({ isActive }) => `block px-4 py-2.5 rounded-md no-underline transition-all ${
              isActive 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                : 'text-white/85 hover:bg-white/10'
            }`}
            onClick={handleClose}
          >
            CRM
          </NavLink>
        </li>
      </ul>
      <div className="p-2 px-4 mt-auto border-t border-white">
        {user && (
          <div className="flex flex-col gap-1 mb-3">
            <span className="font-medium text-white">{user.name}</span>
            <span className="text-xs text-white/60 uppercase">{user.role}</span>
          </div>
        )}
        <button 
          onClick={() => { logout(); handleClose(); }} 
          className="w-full bg-white/8 border border-white text-white px-3 py-3 rounded-md cursor-pointer transition-all text-[0.85rem] font-medium text-center tracking-wide hover:bg-white/15 hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]"
        >
          Sair
        </button>
      </div>
    </nav>
  )

  return (
    <>
      {/* Drawer responsivo */}
      {open && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/35 z-[2000] flex items-stretch" onClick={handleClose}>
          <div
            className="w-[75vw] max-w-[320px] min-w-[180px] bg-gray-900 text-blue-50 h-[calc(100vh-48px)] mt-12 shadow-[2px_0_16px_0_rgba(0,0,0,0.12)] animate-slide-in flex flex-col max-[640px]:w-[68vw] max-[640px]:max-w-[260px]"
            onClick={e => e.stopPropagation()}
          >
            {menuContent}
          </div>
        </div>
      )}
      {/* Menu fixo em desktop */}
      <div
        className="w-[220px] min-w-[180px] bg-gray-900 text-blue-50 h-[calc(100vh-64px)] p-2 flex flex-col items-stretch fixed left-0 top-16 z-[1000] max-[900px]:w-[180px] max-[900px]:min-w-[120px] max-[640px]:hidden"
      >
        {menuContent}
      </div>
    </>
  )
}
