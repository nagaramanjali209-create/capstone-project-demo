import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BookCard from '../components/BookCard'
import { useCart } from '../context/CartContext'
import api from '../api/axios'

const s = {
  page: { minHeight: '100vh', background: '#1a1a2e' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '24px' },
  breadcrumb: { color: '#a0aec0', fontSize: '13px', marginBottom: '20px' },
  layout: { display: 'flex', gap: '32px' },
  imgBox: { width: '240px', flexShrink: 0 },
  img: { width: '100%', borderRadius: '8px', objectFit: 'cover' },
  details: { flex: 1 },
  title: { color: '#fff', fontWeight: 700, fontSize: '24px', marginBottom: '6px' },
  author: { color: '#3b82f6', fontSize: '14px', marginBottom: '8px' },
  desc: { color: '#a0aec0', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' },
  publisher: { color: '#718096', fontSize: '13px', marginBottom: '4px' },
  tagRow: { display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' },
  tag: { background: '#1e3a5f', color: '#a0aec0', borderRadius: '4px', padding: '2px 8px', fontSize: '12px' },
  price: { color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '6px' },
  delivery: { color: '#a0aec0', fontSize: '13px', marginBottom: '16px' },
  btnRow: { display: 'flex', gap: '12px', marginBottom: '20px' },
  cartBtn: { background: '#3b82f6', border: 'none', borderRadius: '8px', padding: '12px 24px', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '14px' },
  wishBtn: { background: '#1e2a3a', border: '1px solid #3b82f6', borderRadius: '8px', padding: '12px 24px', color: '#3b82f6', cursor: 'pointer', fontWeight: 600, fontSize: '14px' },
  meta: { display: 'flex', gap: '24px', marginBottom: '20px' },
  metaItem: { color: '#a0aec0', fontSize: '13px' },
  metaVal: { color: '#fff', fontWeight: 600 },
  sidebar: { width: '220px', flexShrink: 0 },
  relTitle: { color: '#fff', fontWeight: 600, fontSize: '15px', marginBottom: '12px' },
  writersCard: { background: '#16213e', borderRadius: '8px', padding: '16px', marginBottom: '20px' },
  writerImg: { width: '48px', height: '48px', borderRadius: '50%', background: '#2d4a6e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '10px' },
  writerName: { color: '#fff', fontWeight: 600, fontSize: '14px', marginBottom: '6px' },
  writerBio: { color: '#a0aec0', fontSize: '12px', lineHeight: '1.5' },
  reviewsSection: { marginTop: '28px' },
  reviewTitle: { color: '#fff', fontWeight: 600, fontSize: '16px', marginBottom: '16px' },
  reviewCard: { background: '#16213e', borderRadius: '8px', padding: '14px', marginBottom: '12px' },
  reviewAuthor: { color: '#fff', fontWeight: 600, fontSize: '13px', marginBottom: '4px' },
  reviewText: { color: '#a0aec0', fontSize: '13px', lineHeight: '1.5', marginBottom: '8px' },
  stars: { color: '#f59e0b', fontSize: '14px' },
  reviewForm: { background: '#16213e', borderRadius: '8px', padding: '16px', marginBottom: '16px' },
  textarea: { width: '100%', background: '#0f3460', border: '1px solid #2d3748', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', resize: 'vertical', minHeight: '80px', outline: 'none', marginBottom: '12px' },
  submitBtn: { background: '#3b82f6', border: 'none', borderRadius: '8px', padding: '8px 20px', color: '#fff', cursor: 'pointer', fontWeight: 600 },
}

const Stars = ({ rating }) => '★'.repeat(Math.round(rating || 0)) + '☆'.repeat(5 - Math.round(rating || 0))

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [reviewContent, setReviewContent] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    api.get(`/api/products/${id}`).then(r => setProduct(r.data)).catch(() => navigate('/'))
    api.get(`/api/products/${id}/related`).then(r => setRelated(r.data)).catch(() => {})
  }, [id])

  const handleAddToCart = async () => {
    await addToCart(Number(id))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleReview = async e => {
    e.preventDefault()
    if (!reviewContent.trim()) return
    const r = await api.post(`/api/products/${id}/reviews`, { content: reviewContent, rating: reviewRating })
    setProduct(r.data)
    setReviewContent('')
  }

  if (!product) return <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading...</div>

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.breadcrumb}>
          Home / {product.categoryName} / {product.title} / Checkout /
        </div>
        <div style={s.layout}>
          <div style={s.imgBox}>
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.title} style={s.img} onError={e => { e.target.style.display = 'none' }} />
              : <div style={{ ...s.img, height: '320px', background: '#2d4a6e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', borderRadius: '8px' }}>📖</div>
            }
          </div>
          <div style={s.details}>
            <div style={s.title}>{product.title}</div>
            <div style={s.author}>by {product.author}</div>
            <div style={s.publisher}>Published by {product.publisher || 'N/A Publishers'}</div>
            <div style={s.tagRow}>
              <span style={s.tag}>{product.format}</span>
              <span style={s.tag}>{product.categoryName}</span>
            </div>
            <div style={s.desc}>{product.description}</div>
            <div style={s.price}>₹{product.price}</div>
            {product.deliveryDate && <div style={s.delivery}>Delivery by {product.deliveryDate}</div>}
            <div style={s.btnRow}>
              <button style={{ ...s.cartBtn, background: added ? '#48bb78' : '#3b82f6' }} onClick={handleAddToCart}>
                {added ? '✓ Added to Cart' : 'Add to Cart 🛒'}
              </button>
              <button style={s.wishBtn}>Add to Wishlist ♥</button>
            </div>
            <div style={s.meta}>
              <div style={s.metaItem}>Language: <span style={s.metaVal}>{product.language || 'English'}</span></div>
              <div style={s.metaItem}>Rating: <span style={{ color: '#f59e0b' }}>{Stars({ rating: product.rating })} {product.rating}</span></div>
              <div style={s.metaItem}>Sells: <span style={s.metaVal}>{product.salesCount} copies sold</span></div>
            </div>

            {/* About the author */}
            <div style={s.writersCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={s.writerImg}>✍️</div>
                <div>
                  <div style={s.writerName}>{product.author}</div>
                  <div style={{ color: '#3b82f6', fontSize: '12px' }}>{product.categoryName} Author</div>
                </div>
              </div>
              <div style={s.writerBio}>
                {product.author} is a renowned author known for captivating readers with their unique storytelling style. Their works have inspired thousands of readers worldwide to explore new perspectives and ideas.
              </div>
            </div>

            {/* Reviews */}
            <div style={s.reviewsSection}>
              <div style={s.reviewTitle}>Reviews ({product.reviewCount || 0})</div>
              <div style={s.reviewForm}>
                <div style={{ color: '#a0aec0', fontSize: '13px', marginBottom: '6px' }}>Leave Your Review</div>
                <textarea style={s.textarea} placeholder="Placeholder text" value={reviewContent}
                  onChange={e => setReviewContent(e.target.value)} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))}
                    style={{ background: '#0f3460', border: '1px solid #2d3748', borderRadius: '6px', padding: '6px 10px', color: '#fff' }}>
                    {[5,4,3,2,1].map(v => <option key={v} value={v}>{'★'.repeat(v)} {v} stars</option>)}
                  </select>
                  <button style={s.submitBtn} onClick={handleReview}>Submit →</button>
                </div>
              </div>
              {(product.reviews || []).map((r, i) => (
                <div key={i} style={s.reviewCard}>
                  <div style={s.reviewAuthor}>{r.reviewerName}</div>
                  <div style={s.reviewText}>{r.content}</div>
                  <div style={s.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Related sidebar */}
          <div style={s.sidebar}>
            <div style={s.relTitle}>Related Reads</div>
            {related.map(b => (
              <div key={b.id} onClick={() => navigate(`/product/${b.id}`)}
                style={{ display: 'flex', gap: '10px', marginBottom: '14px', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: '#16213e' }}>
                <div style={{ width: '56px', height: '72px', background: '#2d4a6e', borderRadius: '4px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  {b.imageUrl ? <img src={b.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} /> : '📖'}
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>{b.title}</div>
                  <div style={{ color: '#3b82f6', fontSize: '11px' }}>by {b.author}</div>
                  <div style={{ color: '#a0aec0', fontSize: '11px' }}>{b.format}</div>
                  <div style={{ color: '#a0aec0', fontSize: '11px' }}>{b.categoryName}</div>
                  <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>₹{b.price}</div>
                  {b.deliveryDate && <div style={{ color: '#a0aec0', fontSize: '10px' }}>Delivery by {b.deliveryDate}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer style={{ background: '#0d1b2a', borderTop: '1px solid #2d3748', padding: '16px 24px', textAlign: 'center', color: '#4a5568', fontSize: '12px' }}>
        © 2024 BookWorm E-Store — IBM Capstone Project
      </footer>
    </div>
  )
}
