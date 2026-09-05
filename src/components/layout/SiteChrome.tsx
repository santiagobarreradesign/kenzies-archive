import { Link, NavLink, Outlet } from 'react-router-dom'

export function SiteChrome() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-kicker">Birthday Defense Force</span>
          <span className="brand-title">Kenzie&apos;s Pickle Army</span>
        </Link>
        <nav className="nav-links" aria-label="Headquarters navigation">
          <NavLink to="/recruit">Enlist</NavLink>
          <NavLink to="/army">The Army</NavLink>
          <NavLink to="/commander">Commander</NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
