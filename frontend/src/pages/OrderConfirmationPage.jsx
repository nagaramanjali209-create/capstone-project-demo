import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const s = {
  page: { minHeight: '100vh', background: '#1a1a2e' },
  overlay: { minHeight: 'calc(100vh - 56px)', background: 'linear-gradient(135deg,#0d2137 0%,#1a3a5c 50%,#0d2137 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  modal: { background: '#16213e', borderRadius: '12px', padding: '32px', width: '560px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', zIndex: 1 },
  checkCircle: { width: '56px', height: '56px', background: '#48bb78', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' },
  successText: { color: '#fff', fontSize: '16px', marginBottom: '24px', fontWeight: 500 },
  booksRow: { display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' },
  bookItem: { display: 'flex', gap: '12px', background: '#1e2a3a', borderRadius: '8px', padding: '12px', textAlign: 'left', width: '220px' },
  imgBox: { width: '60px', height: '80px', background: '#2d4a6e', borderRadius: '4px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', overflow: 'hidden' },
  bookTitle: { color: '#fff', fontWeight: 600, fontSize: '13px', marginBottom: '2px' },
  bookAuthor: { color: '#3b82f6', fontSize: '11px', marginBottom: '4px' },
  bookTag: { color: '#718096', fontSize: '11px', marginBottom: '4px' },
  bookPrice: { color: '#fff', fontWeight: 700, fontSize: '13px', marginBottom: '2px' },
  bookDelivery: { color: '#a0aec0', fontSize: '10px' },
  continueBtn: { background: '#3b82f6', border: 'none', borderRadius: '8px', padding: '12px 28px', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' },
  orderId: { color: '#a0aec0', fontSize: '12px', marginBottom: '16px' },
}

export default function OrderConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { order } = location.state || {}

  if (!order) {
    return (
      <div style={s.page}>
        <Navbar />
        <div style={{ ...s.overlay }}>
          <div style={s.modal}>
            <div style={s.checkCircle}>✓</div>
            <div style={s.successText}>Your purchase was successful!</div>
            <button style={s.continueBtn} onClick={() => navigate('/')}>Continue Shopping 📚</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.overlay}>
        <div style={{ position: 'absolute', fontSize: '80px', top: '10%', left: '5%', opacity: 0.3 }}>📚</div>
        <div style={{ position: 'absolute', fontSize: '60px', bottom: '15%', right: '10%', opacity: 0.2 }}>📖</div>
        <div style={s.modal}>
          <div style={s.checkCircle}>✓</div>
          <div style={s.successText}>Your purchase of the following reads is successful</div>
          <div style={s.orderId}>Order #{order.orderId} | Transaction: {order.transactionId}</div>
          <div style={s.booksRow}>
            {(order.items || []).map((item, i) => (
              <div key={i} style={s.bookItem}>
                <div style={s.imgBox}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : '📖'}
                </div>
                <div>
                  <div style={s.bookTitle}>{item.title}</div>
                  <div style={s.bookAuthor}>by {item.author}</div>
                  <div style={s.bookTag}>{item.categoryName}</div>
                  <div style={s.bookPrice}>₹{item.unitPrice}</div>
                  {item.deliveryDate && <div style={s.bookDelivery}>Delivery by {item.deliveryDate}</div>}
                </div>
              </div>
            ))}
          </div>
          <button style={s.continueBtn} onClick={() => navigate('/')}>Continue your Shopping 📚</button>
        </div>
      </div>
      <footer style={{ background: '#0d1b2a', borderTop: '1px solid #2d3748', padding: '16px 24px', textAlign: 'center', color: '#4a5568', fontSize: '12px', position: 'relative', zIndex: 1 }}>
        © 2024 BookWorm E-Store — IBM Capstone Project
      </footer>
    </div>
  )
}
