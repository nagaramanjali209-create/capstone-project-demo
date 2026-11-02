import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const s = {
  page: { minHeight: '100vh', background: '#1a1a2e' },
  modal: { background: '#16213e', borderRadius: '12px', padding: '28px', width: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' },
  modalTitle: { color: '#fff', fontWeight: 700, fontSize: '18px', marginBottom: '4px' },
  methodsCol: { width: '130px', borderRight: '1px solid #2d3748', paddingRight: '16px' },
  method: { padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', color: '#a0aec0', fontSize: '13px', marginBottom: '4px' },
  methodActive: { background: '#1e3a5f', color: '#3b82f6', fontWeight: 600 },
  fieldsCol: { flex: 1, paddingLeft: '20px' },
  label: { color: '#a0aec0', fontSize: '12px', marginBottom: '4px', display: 'block' },
  input: { width: '100%', background: '#0f3460', border: '1px solid #2d3748', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none', marginBottom: '14px' },
  row2: { display: 'flex', gap: '12px' },
  payBtn: { width: '100%', background: '#3b82f6', border: 'none', borderRadius: '8px', padding: '12px', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
}

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addr, coupon, total } = location.state || {}

  const [method, setMethod] = useState('CREDIT_CARD')
  const [card, setCard] = useState({ number: '', name: '', cvv: '', expiry: '' })
  const [upi, setUpi] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = k => e => setCard(c => ({ ...c, [k]: e.target.value }))

  const handlePay = async () => {
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...(addr || {}),
        couponCode: coupon || null,
        paymentMethod: method,
        cardNumber: card.number,
        nameOnCard: card.name,
        cvv: card.cvv,
        expiryDate: card.expiry,
        upiId: upi,
      }
      const r = await api.post('/api/orders/checkout', payload)
      navigate('/order-confirmation', { state: { order: r.data } })
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const methods = [
    { key: 'CREDIT_CARD', label: 'Credit Card' },
    { key: 'DEBIT_CARD', label: 'Debit card' },
    { key: 'UPI', label: 'UPI' },
    { key: 'WALLET', label: 'Wallet' },
  ]

  return (
    <div style={s.page}>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 56px)', background: 'linear-gradient(135deg,#0d2137 0%,#1a3a5c 50%,#0d2137 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', fontSize: '80px', top: '10%', left: '5%', opacity: 0.3 }}>📚</div>
        <div style={{ position: 'absolute', fontSize: '60px', top: '50%', left: '8%', opacity: 0.2 }}>📖</div>
        <div style={{ position: 'absolute', fontSize: '70px', top: '20%', right: '8%', opacity: 0.25 }}>📘</div>
        <div style={{ position: 'absolute', fontSize: '50px', bottom: '15%', right: '10%', opacity: 0.2 }}>📕</div>
        <div style={s.modal}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={s.modalTitle}>Complete Payment</div>
            <div style={{ color: '#fff', fontWeight: 700 }}>Payable Amount: ₹{total || 0}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={s.methodsCol}>
              {methods.map(m => (
                <div key={m.key}
                  style={{ ...s.method, ...(method === m.key ? s.methodActive : {}) }}
                  onClick={() => setMethod(m.key)}>
                  {m.label}
                </div>
              ))}
            </div>
            <div style={s.fieldsCol}>
              {(method === 'CREDIT_CARD' || method === 'DEBIT_CARD') && (
                <>
                  <label style={s.label}>Card Number</label>
                  <input style={s.input} placeholder="XXXX-XXXX-XXXX-XXXX" value={card.number} onChange={set('number')} maxLength={19} />
                  <label style={s.label}>Name on Card</label>
                  <input style={s.input} placeholder="Name" value={card.name} onChange={set('name')} />
                  <div style={s.row2}>
                    <div style={{ flex: 1 }}>
                      <label style={s.label}>CVV</label>
                      <input style={s.input} placeholder="XXX" value={card.cvv} onChange={set('cvv')} maxLength={3} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={s.label}>Date of Expiry</label>
                      <input style={s.input} placeholder="MM/YYYY" value={card.expiry} onChange={set('expiry')} />
                    </div>
                  </div>
                </>
              )}
              {method === 'UPI' && (
                <>
                  <label style={s.label}>UPI ID</label>
                  <input style={s.input} placeholder="yourname@upi" value={upi} onChange={e => setUpi(e.target.value)} />
                </>
              )}
              {method === 'WALLET' && (
                <div style={{ color: '#a0aec0', fontSize: '13px', paddingTop: '16px' }}>Gift Points / Wallet balance will be applied at checkout.</div>
              )}
              {error && <div style={{ color: '#e94560', fontSize: '12px', marginBottom: '8px' }}>{error}</div>}
              <button style={s.payBtn} onClick={handlePay} disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now 🔒'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer style={{ background: '#0d1b2a', borderTop: '1px solid #2d3748', padding: '16px 24px', textAlign: 'center', color: '#4a5568', fontSize: '12px' }}>
        © 2024 BookWorm E-Store — IBM Capstone Project
      </footer>
    </div>
  )
}
