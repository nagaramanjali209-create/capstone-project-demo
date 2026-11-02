import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BookCard from '../components/BookCard'
import api from '../api/axios'

const s = {
  page: { minHeight: '100vh', background: '#1a1a2e' },
  layout: { display: 'flex' },
  sidebar: { width: '200px', minHeight: 'calc(100vh - 56px)', background: '#0d1b2a', borderRight: '1px solid #2d3748', padding: '16px 0', flexShrink: 0 },
  sideItem: { padding: '8px 20px', color: '#a0aec0', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s', borderLeft: '3px solid transparent' },
  main: { flex: 1, padding: '24px' },
  searchRow: { display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' },
  searchInput: { flex: 1, background: '#16213e', border: '1px solid #2d3748', borderRadius: '8px', padding: '10px 16px', color: '#fff', fontSize: '14px', outline: 'none' },
  searchBtn: { background: '#3b82f6', border: 'none', borderRadius: '8px', padding: '10px 20px', color: '#fff', cursor: 'pointer', fontWeight: 600 },
  select: { background: '#16213e', border: '1px solid #2d3748', borderRadius: '8px', padding: '10px 12px', color: '#a0aec0', fontSize: '13px', cursor: 'pointer' },
  section: { marginBottom: '32px' },
  sectionTitle: { color: '#fff', fontWeight: 700, fontSize: '16px', marginBottom: '16px' },
  booksRow: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
}

const CATEGORIES = ['All','Romance','Mystery','Science Fiction','Fantasy','Historical','Biography','Self-Help','Memoir','Travel','Cooking',"Children's",'Young Adult','Comics & Graphic Novels','Poetry','Drama','Science','Philosophy','Religion','Language Learning']

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [bestsellers, setBestsellers] = useState([])
  const [newLaunches, setNewLaunches] = useState([])
  const [filtered, setFiltered] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/products/featured').then(r => setFeatured(r.data)).catch(() => {})
    api.get('/api/products/bestsellers').then(r => setBestsellers(r.data)).catch(() => {})
    api.get('/api/products/new-launches').then(r => setNewLaunches(r.data)).catch(() => {})
    api.get('/api/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  const handleSearch = async () => {
    if (!keyword.trim()) { setFiltered([]); return }
    setLoading(true)
    try {
      const r = await api.get(`/api/products?keyword=${keyword}`)
      setFiltered(r.data.content || [])
    } catch { setFiltered([]) } finally { setLoading(false) }
  }

  const handleCatSelect = async (cat) => {
    setSelectedCat(cat.id)
    setLoading(true)
    try {
      const r = await api.get(`/api/products?categoryId=${cat.id}`)
      setFiltered(r.data.content || [])
    } catch { setFiltered([]) } finally { setLoading(false) }
  }

  const BookSection = ({ title, books }) => (
    <div style={s.section}>
      <div style={s.sectionTitle}>{title}</div>
      <div style={s.booksRow}>
        {books.map(b => (
          <BookCard key={b.id} book={b} onClick={() => navigate(`/product/${b.id}`)} />
        ))}
      </div>
    </div>
  )

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.layout}>
        <div style={s.sidebar}>
          {CATEGORIES.map(cat => (
            <div key={cat}
              style={{ ...s.sideItem, ...(cat === 'All' && !selectedCat ? { color: '#fff', borderLeftColor: '#3b82f6' } : {}) }}
              onClick={async () => {
                if (cat === 'All') { setSelectedCat(null); setFiltered([]); return }
                const found = categories.find(c => c.name === cat)
                if (found) handleCatSelect(found)
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#1e2a3a' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#a0aec0'; e.currentTarget.style.background = 'none' }}
            >{cat}</div>
          ))}
        </div>
        <div style={s.main}>
          <div style={s.searchRow}>
            <input style={s.searchInput} placeholder="Search you want to read here..." value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            <button style={s.searchBtn} onClick={handleSearch}>🔍</button>
            <select style={s.select}><option>Language: All</option><option>English</option><option>Hindi</option></select>
            <select style={s.select}><option>Format: All</option><option>Paperback</option><option>eBook</option></select>
            <select style={s.select}><option>Sort: Relevance</option><option>Price: Low-High</option><option>Rating</option></select>
          </div>

          {loading && <div style={{ color: '#a0aec0', textAlign: 'center', padding: '40px' }}>Loading...</div>}

          {!loading && filtered.length > 0 && (
            <BookSection title={`Search Results (${filtered.length})`} books={filtered} />
          )}

          {!loading && filtered.length === 0 && (
            <>
              <BookSection title="Recommended for You" books={featured} />
              <BookSection title="Bestsellers this Month" books={bestsellers} />
              <BookSection title="New Launches" books={newLaunches} />
            </>
          )}
        </div>
      </div>
      <footer style={{ background: '#0d1b2a', borderTop: '1px solid #2d3748', padding: '16px 24px', textAlign: 'center', color: '#4a5568', fontSize: '12px' }}>
        © 2024 BookWorm E-Store — IBM Capstone Project
      </footer>
    </div>
  )
}
