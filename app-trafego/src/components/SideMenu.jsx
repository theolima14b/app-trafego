
import { useState, useEffect } from 'react'
import './SideMenu.css'
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
    <nav className="side-menu__drawer" aria-label="Main navigation">
      <ul className="side-menu__list">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleClose}>
            Overview
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/campanhas"
            className={() => (isCampanhasActive ? 'active' : '')}
            onClick={(e) => {
              e.preventDefault()
              setCampanhasOpen(prev => !prev)
            }}
            aria-expanded={campanhasOpen}
          >
            <span>Campanhas</span>
            <span className="dropdown-indicator">{campanhasOpen ? '▲' : '▼'}</span>
          </NavLink>
          {campanhasOpen && (
            <ul className="side-menu__submenu">
              <li>
                <NavLink to="/campanhas/gerador-utm" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleClose}>
                  Gerador de UTM
                </NavLink>
              </li>
              <li>
                <NavLink to="/campanhas/analise-de-campanha" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleClose}>
                  Análise de Campanha
                </NavLink>
              </li>
              <li>
                <NavLink to="/campanhas/criador-de-copies" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleClose}>
                  Criador de Copies
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        
        <li>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleClose}>
            CRM
          </NavLink>
        </li>
      </ul>
      <div className="side-menu__footer">
        {user && (
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        )}
        <button onClick={() => { logout(); handleClose(); }} className="logout-button">
          Sair
        </button>
      </div>
    </nav>
  )

  return (
    <>
      {/* Drawer responsivo */}
      {open && (
        <div className="side-menu__overlay" onClick={handleClose}>
          <div className="side-menu__drawer-container" onClick={e => e.stopPropagation()}>
            {menuContent}
          </div>
        </div>
      )}
      {/* Menu fixo em desktop */}
      <div className="side-menu side-menu--desktop">
        {menuContent}
      </div>
    </>
  )
}
