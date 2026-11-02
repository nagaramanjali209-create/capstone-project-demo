import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const s = {
  page: { minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { background: '#16213e', borderRadius: '12px', padding: '40px', width: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
  logo: { textAlign: 'center', fontSize: '32px', marginBottom: '8px' },
  title: { textAlign: 'center', color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '4px' },
  sub: { textAlign: 'center', color: '#a0aec0', fontSize: '13px', marginBottom: '28px' },
  label: { color: '#a0aec0', fontSize: '13px', marginBottom: '6px', display: 'block' },
  input: { width: '100%', background: '#0f3460', border: '1px solid #2d3748', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none', marginBottom: '16px' },
  btn: { width: '100%', background: '#3b82f6', border: 'none', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' },
  err: { color: '#e94560', fontSize: '13px', marginBottom: '12px', textAlign: 'center' },
  link: { textAlign: 'center', marginTop: '20px', color: '#a0aec0', fontSize: '13px' },
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Try demo@bookworm.com / demo123')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>📚</div>
        <div style={s.title}>Book Worm</div>
        <div style={s.sub}>Sign in to your account</div>
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email Address</label>
          <input style={s.input} type="email" placeholder="demo@bookworm.com" value={email}
            onChange={e => setEmail(e.target.value)} required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="••••••" value={password}
            onChange={e => setPassword(e.target.value)} required />
          {error && <div style={s.err}>{error}</div>}
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div style={s.link}>
          Don't have an account? <Link to="/register" style={{ color: '#3b82f6' }}>Register</Link>
        </div>
        <div style={{ ...s.link, marginTop: '12px', fontSize: '12px', color: '#4a5568' }}>
          Demo: demo@bookworm.com / demo123
        </div>
      </div>
    </div>
  )
}
