
import { useState, useEffect } from 'react'
import './SideMenu.css'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SideMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  // Listener para abrir menu via evento customizado do header
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-mobile-menu', handler)
    return () => window.removeEventListener('open-mobile-menu', handler)
  }, [])

  // Fecha o menu ao clicar em um link ou overlay
  const handleClose = () => setOpen(false)

  // Renderiza o menu lateral (drawer)
  const menuContent = (
    <nav className="side-menu__drawer" aria-label="Main navigation">
      <ul className="side-menu__list">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleClose}>
            Início
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleClose}>
            Painel
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleClose}>
            Relatórios
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleClose}>
            Configurações
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleClose}>
            Sobre
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
