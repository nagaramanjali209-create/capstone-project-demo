import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const s = {
  page: { minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { background: '#16213e', borderRadius: '12px', padding: '40px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
  logo: { textAlign: 'center', fontSize: '32px', marginBottom: '8px' },
  title: { textAlign: 'center', color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '4px' },
  sub: { textAlign: 'center', color: '#a0aec0', fontSize: '13px', marginBottom: '28px' },
  label: { color: '#a0aec0', fontSize: '13px', marginBottom: '6px', display: 'block' },
  input: { width: '100%', background: '#0f3460', border: '1px solid #2d3748', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none', marginBottom: '16px' },
  row: { display: 'flex', gap: '12px' },
  btn: { width: '100%', background: '#3b82f6', border: 'none', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' },
  err: { color: '#e94560', fontSize: '13px', marginBottom: '12px', textAlign: 'center' },
  link: { textAlign: 'center', marginTop: '20px', color: '#a0aec0', fontSize: '13px' },
}

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>📚</div>
        <div style={s.title}>Create Account</div>
        <div style={s.sub}>Join Book Worm today</div>
        <form onSubmit={handleSubmit}>
          <div style={s.row}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>First Name</label>
              <input style={s.input} placeholder="First Name" value={form.firstName} onChange={set('firstName')} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Last Name</label>
              <input style={s.input} placeholder="Last Name" value={form.lastName} onChange={set('lastName')} />
            </div>
          </div>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
          <label style={s.label}>Phone Number</label>
          <input style={s.input} placeholder="+91 9876543210" value={form.phoneNumber} onChange={set('phoneNumber')} />
          {error && <div style={s.err}>{error}</div>}
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div style={s.link}>
          Already have an account? <Link to="/login" style={{ color: '#3b82f6' }}>Sign In</Link>
        </div>
      </div>
    </div>
  )
}
