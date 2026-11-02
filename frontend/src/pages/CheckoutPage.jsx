import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'

const s = {
  page: { minHeight: '100vh', background: '#1a1a2e' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '24px' },
  breadcrumb: { color: '#a0aec0', fontSize: '13px', marginBottom: '20px' },
  title: { color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '24px' },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  left: { flex: 1 },
  right: { width: '280px', flexShrink: 0 },
  cartItem: { background: '#16213e', borderRadius: '8px', padding: '16px', marginBottom: '12px', display: 'flex', gap: '16px' },
  imgBox: { width: '80px', height: '110px', background: '#2d4a6e', borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', overflow: 'hidden' },
  itemTitle: { color: '#fff', fontWeight: 600, fontSize: '15px', marginBottom: '4px' },
  itemAuthor: { color: '#3b82f6', fontSize: '12px', marginBottom: '4px' },
  itemDesc: { color: '#a0aec0', fontSize: '12px', marginBottom: '8px', lineHeight: '1.4' },
  itemTag: { color: '#718096', fontSize: '11px', marginBottom: '8px' },
  itemPrice: { color: '#fff', fontWeight: 700, fontSize: '16px' },
  itemDelivery: { color: '#a0aec0', fontSize: '11px' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' },
  qtyBtn: { background: '#2d3748', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  qtyNum: { color: '#fff', fontWeight: 600, minWidth: '20px', textAlign: 'center' },
  removeBtn: { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '13px', marginLeft: 'auto' },
  addrCard: { background: '#16213e', borderRadius: '8px', padding: '20px', marginTop: '20px' },
  addrTitle: { color: '#fff', fontWeight: 600, fontSize: '16px', marginBottom: '16px' },
  checkRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#a0aec0', fontSize: '13px' },
  row2: { display: 'flex', gap: '12px', marginBottom: '12px' },
  input: { flex: 1, background: '#0f3460', border: '1px solid #2d3748', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none' },
  summaryCard: { background: '#16213e', borderRadius: '8px', padding: '20px', overflow: 'hidden' },
  summaryImg: { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '16px', background: 'linear-gradient(135deg,#1e3a5f,#2d4a6e)' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' },
  summaryLabel: { color: '#a0aec0' },
  summaryVal: { color: '#fff' },
  divider: { borderTop: '1px solid #2d3748', margin: '12px 0' },
  couponRow: { display: 'flex', gap: '8px', marginBottom: '12px' },
  couponInput: { flex: 1, background: '#0f3460', border: '1px solid #2d3748', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' },
  applyBtn: { background: '#3b82f6', border: 'none', borderRadius: '6px', padding: '8px 16px', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '13px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 700, fontSize: '16px', marginBottom: '16px' },
  payBtn: { width: '100%', background: '#3b82f6', border: 'none', borderRadius: '8px', padding: '12px', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer' },
}

export default function CheckoutPage() {
  const { cart, updateCartItem, removeCartItem } = useCart()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [useSaved, setUseSaved] = useState(false)
  const [addr, setAddr] = useState({ firstName: '', lastName: '', addressLine: '', email: '', city: '', pin: '', phoneNumber: '+91', state: '', country: 'India' })
  const set = k => e => setAddr(a => ({ ...a, [k]: e.target.value }))

  const subtotal = cart?.items?.reduce((s, i) => s + i.totalPrice, 0) || 0
  const tax = +(subtotal * 0.12).toFixed(2)
  const total = +(subtotal + tax - discount).toFixed(2)

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'BOOK10') setDiscount(100)
    else setDiscount(0)
  }

  const handlePayNow = () => {
    if (!cart?.items?.length) return
    navigate('/payment', { state: { addr, coupon, subtotal, tax, discount, total } })
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.breadcrumb}>Home / Non-Fiction / Self Help / Joy of Minimalism / Checkout /</div>
        <div style={s.title}>Shopping Cart</div>
        <div style={s.layout}>
          <div style={s.left}>
            {!cart?.items?.length
              ? <div style={{ color: '#a0aec0', textAlign: 'center', padding: '60px' }}>Your cart is empty. <span style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => navigate('/')}>Browse books</span></div>
              : cart.items.map(item => (
                <div key={item.cartItemId} style={s.cartItem}>
                  <div style={s.imgBox}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : '📖'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={s.itemTitle}>{item.title}</div>
                    <div style={s.itemAuthor}>by {item.author}</div>
                    <div style={s.itemTag}>{item.categoryName}</div>
                    <div style={s.itemPrice}>₹{item.unitPrice}</div>
                    {item.deliveryDate && <div style={s.itemDelivery}>Delivery by {item.deliveryDate}</div>}
                    <div style={s.qtyRow}>
                      <button style={s.qtyBtn} onClick={() => updateCartItem(item.cartItemId, item.quantity - 1)}>−</button>
                      <span style={s.qtyNum}>{item.quantity}</span>
                      <button style={s.qtyBtn} onClick={() => updateCartItem(item.cartItemId, item.quantity + 1)}>+</button>
                      <button style={s.removeBtn} onClick={() => removeCartItem(item.cartItemId)}>Remove ✕</button>
                    </div>
                  </div>
                </div>
              ))
            }

            {/* Address form */}
            <div style={s.addrCard}>
              <div style={s.addrTitle}>Address</div>
              <div style={s.checkRow}>
                <input type="checkbox" checked={useSaved} onChange={e => setUseSaved(e.target.checked)} />
                Use Saved Address
              </div>
              <div style={s.row2}>
                <input style={s.input} placeholder="First Name" value={addr.firstName} onChange={set('firstName')} />
                <input style={s.input} placeholder="Last Name" value={addr.lastName} onChange={set('lastName')} />
                <input style={s.input} placeholder="Address Line 2" value={addr.addressLine} onChange={set('addressLine')} />
              </div>
              <div style={s.row2}>
                <input style={s.input} placeholder="e-mail" value={addr.email} onChange={set('email')} />
                <input style={s.input} placeholder="City" value={addr.city} onChange={set('city')} />
                <input style={s.input} placeholder="000000" value={addr.pin} onChange={set('pin')} />
              </div>
              <div style={s.row2}>
                <input style={s.input} placeholder="+91 12345567890" value={addr.phoneNumber} onChange={set('phoneNumber')} />
                <input style={s.input} placeholder="State" value={addr.state} onChange={set('state')} />
                <input style={s.input} placeholder="India" value={addr.country} onChange={set('country')} />
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div style={s.right}>
            <div style={s.summaryCard}>
              <div style={{ ...s.summaryImg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🛒</div>
              <div style={s.summaryRow}><span style={s.summaryLabel}>Price ({cart?.items?.length || 0} items)</span><span style={s.summaryVal}>₹{subtotal.toFixed(2)}</span></div>
              <div style={s.summaryRow}><span style={s.summaryLabel}>Tax</span><span style={s.summaryVal}>₹{tax.toFixed(2)}</span></div>
              <div style={s.summaryRow}><span style={s.summaryLabel}>Delivery Charges</span><span style={{ color: '#48bb78' }}>Free</span></div>
              <div style={s.divider} />
              <div style={s.couponRow}>
                <input style={s.couponInput} placeholder="Apply Coupon" value={coupon} onChange={e => setCoupon(e.target.value)} />
                <button style={s.applyBtn} onClick={applyCoupon}>Apply</button>
              </div>
              {discount > 0 && <div style={{ ...s.summaryRow, color: '#48bb78' }}><span>Discount</span><span>−₹{discount}</span></div>}
              <div style={s.divider} />
              <div style={s.totalRow}><span>Total Amount</span><span>₹{total.toFixed(2)}</span></div>
              <button style={s.payBtn} onClick={handlePayNow}>Pay Now 🔒</button>
              <div style={{ color: '#4a5568', fontSize: '11px', textAlign: 'center', marginTop: '8px' }}>Coupon: BOOK10 for ₹100 off</div>
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
