import React, { useEffect, useState } from 'react'
import './Header.css'
import { NavLink } from 'react-router-dom'

export const Header = () => {
  const [open, setOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(() => {
    const token = localStorage.getItem('token')
    return !!token
  })

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token')
      setAuthenticated(!!token)
    }
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const closeMenu = () => setOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('staff')
    setAuthenticated(false)
    closeMenu()
    window.location.href = '/'
  }

  const handleActivity = () => {
    closeMenu()
    window.location.href = '/activity'
  }

  return (
    <header>
      <img
        src='https://www.creativefabrica.com/wp-content/uploads/2023/04/24/restaurant-logo-design-Graphics-67998518-2-580x405.jpg'
        alt='jarama-logo'
        className='logo'
      />
      <nav className={open ? 'menu_vertical' : 'nodisplay'}>
        <ul>
          <li>
            <NavLink
              to='/'
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>

          {!authenticated && (
            <li>
              <NavLink
                to='/about'
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeMenu}
              >
                AboutUs
              </NavLink>
            </li>
          )}

          {authenticated ? (
            <>
              <li>
                <NavLink
                  to='/events'
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={closeMenu}
                >
                  Events
                </NavLink>
              </li>
              <li>
                <button className='logout-button' onClick={handleLogout}>
                  Logout
                </button>
              </li>
              <li>
                <button className='activity' onClick={handleActivity}>
                  Activity
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink
                to='/login'
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeMenu}
              >
                Login
              </NavLink>
            </li>
          )}

          {!authenticated && (
            <li>
              <NavLink
                to='/register'
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
