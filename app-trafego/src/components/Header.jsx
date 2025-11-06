import './Header.css'
import { useState } from 'react'

export default function Header() {
  // Dispara evento customizado para abrir o menu drawer
  const handleHamburgerClick = () => {
    const event = new CustomEvent('open-mobile-menu')
    window.dispatchEvent(event)
  }

  return (
    <header className="main-header">
      <span className="main-header__title">Copiloto de Conversão</span>
      <button
        className="side-menu__hamburger main-header__hamburger"
        aria-label="Abrir menu"
        onClick={handleHamburgerClick}
      >
        <span className="hamburger-bar hamburger-bar--light" />
        <span className="hamburger-bar hamburger-bar--light" />
        <span className="hamburger-bar hamburger-bar--light" />
      </button>
    </header>
  )
}