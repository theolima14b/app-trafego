import './SideMenu.css'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SideMenu() {
  const { user, logout } = useAuth()

  return (
    <nav className="side-menu" aria-label="Main navigation">
      <div className="side-menu__brand">MENU</div>
      <ul className="side-menu__list">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Início
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Painel
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
            Relatórios
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
            Configurações
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
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
        <button onClick={logout} className="logout-button">
          Sair
        </button>
      </div>
    </nav>
  )
}
