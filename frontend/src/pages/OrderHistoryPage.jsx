import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const s = {
  page: { minHeight: '100vh', background: '#1a1a2e' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '24px' },
  title: { color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '24px' },
  orderCard: { background: '#16213e', borderRadius: '8px', padding: '20px', marginBottom: '16px' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  orderId: { color: '#fff', fontWeight: 600, fontSize: '15px' },
  status: { borderRadius: '4px', padding: '4px 10px', fontSize: '12px', fontWeight: 600 },
  itemRow: { display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'center' },
  imgBox: { width: '48px', height: '64px', background: '#2d4a6e', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', overflow: 'hidden', flexShrink: 0 },
  itemTitle: { color: '#fff', fontSize: '13px', fontWeight: 600 },
  itemAuthor: { color: '#3b82f6', fontSize: '11px' },
  itemPrice: { color: '#fff', fontSize: '12px', fontWeight: 700 },
  total: { color: '#fff', fontWeight: 700, fontSize: '15px', textAlign: 'right', marginTop: '8px', borderTop: '1px solid #2d3748', paddingTop: '8px' },
  cancelBtn: { background: '#e94560', border: 'none', borderRadius: '6px', padding: '6px 14px', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600 },
  buyAgainBtn: { background: '#3b82f6', border: 'none', borderRadius: '6px', padding: '6px 14px', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600 },
}

const statusColors = {
  CONFIRMED: { background: '#1c4532', color: '#48bb78' },
  PENDING: { background: '#744210', color: '#ed8936' },
  CANCELLED: { background: '#742a2a', color: '#fc8181' },
  SHIPPED: { background: '#1a365d', color: '#63b3ed' },
  DELIVERED: { background: '#1c4532', color: '#48bb78' },
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/orders/history').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleCancel = async (orderId) => {
    try {
      const r = await api.put(`/api/orders/${orderId}/cancel`)
      setOrders(prev => prev.map(o => o.orderId === orderId ? r.data : o))
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel order')
    }
  }

  const handleBuyAgain = (order) => {
    navigate('/')
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.title}>My Orders</div>
        {loading && <div style={{ color: '#a0aec0', textAlign: 'center', padding: '40px' }}>Loading orders...</div>}
        {!loading && orders.length === 0 && (
          <div style={{ color: '#a0aec0', textAlign: 'center', padding: '60px' }}>
            No orders yet. <span style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => navigate('/')}>Start shopping</span>
          </div>
        )}
        {orders.map(order => (
          <div key={order.orderId} style={s.orderCard}>
            <div style={s.orderHeader}>
              <div>
                <div style={s.orderId}>Order #{order.orderId}</div>
                <div style={{ color: '#718096', fontSize: '12px' }}>Transaction: {order.transactionId}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ ...s.status, ...(statusColors[order.status] || {}) }}>{order.status}</span>
                {(order.status === 'CONFIRMED' || order.status === 'PENDING') && (
                  <button style={s.cancelBtn} onClick={() => handleCancel(order.orderId)}>Cancel</button>
                )}
                <button style={s.buyAgainBtn} onClick={() => handleBuyAgain(order)}>Buy Again</button>
              </div>
            </div>
            {(order.items || []).map((item, i) => (
              <div key={i} style={s.itemRow}>
                <div style={s.imgBox}>
                  {item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📖'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={s.itemTitle}>{item.title}</div>
                  <div style={s.itemAuthor}>by {item.author}</div>
                </div>
                <div style={s.itemPrice}>₹{item.unitPrice} × {item.quantity}</div>
              </div>
            ))}
            <div style={s.total}>Total: ₹{order.totalAmount}</div>
          </div>
        ))}
      </div>
      <footer style={{ background: '#0d1b2a', borderTop: '1px solid #2d3748', padding: '16px 24px', textAlign: 'center', color: '#4a5568', fontSize: '12px' }}>
        © 2024 BookWorm E-Store — IBM Capstone Project
      </footer>
    </div>
  )
}
