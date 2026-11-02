import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

const styles = {
  navbar: {
    background: '#0d1b2a',
    borderBottom: '1px solid #2d3748',
    padding: '0 24px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '18px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  nav: { display: 'flex', alignItems: 'center', gap: '24px' },
  navLink: { color: '#a0aec0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' },
  cartBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    position: 'relative',
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-8px',
    background: '#e94560',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { color: '#a0aec0', fontSize: '13px' },
  logoutBtn: {
    background: 'none',
    border: '1px solid #4a5568',
    color: '#a0aec0',
    cursor: 'pointer',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '13px',
  },
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        📚 Book Worm
      </Link>
      <div style={styles.nav}>
        <Link to="/orders" style={styles.navLink}>My Orders</Link>
        <Link to="/" style={styles.navLink}>My Wishlist</Link>
        <Link to="/" style={styles.navLink}>My Writers</Link>
        <button style={styles.cartBtn} onClick={() => navigate('/checkout')}>
          🛒
          {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
        </button>
        <span style={styles.userInfo}>Hi, {user?.firstName}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}
