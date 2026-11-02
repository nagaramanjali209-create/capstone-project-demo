const styles = {
  card: {
    background: '#1e2a3a',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    width: '160px',
    flexShrink: 0,
  },
  img: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    background: '#2d3748',
  },
  info: { padding: '10px' },
  title: { color: '#fff', fontWeight: 600, fontSize: '13px', marginBottom: '4px', lineHeight: '1.3' },
  author: { color: '#3b82f6', fontSize: '11px', marginBottom: '6px' },
  tag: { color: '#a0aec0', fontSize: '11px', marginBottom: '6px' },
  price: { color: '#fff', fontWeight: 700, fontSize: '15px', marginBottom: '2px' },
  delivery: { color: '#a0aec0', fontSize: '11px' },
}

export default function BookCard({ book, onClick }) {
  return (
    <div
      style={styles.card}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {book.imageUrl ? (
        <img src={book.imageUrl} alt={book.title} style={styles.img} onError={e => { e.target.style.background = '#2d4a6e'; e.target.src = '' }} />
      ) : (
        <div style={{ ...styles.img, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>📖</div>
      )}
      <div style={styles.info}>
        <div style={styles.title}>{book.title}</div>
        <div style={styles.author}>by {book.author}</div>
        <div style={styles.tag}>{book.format} | {book.categoryName}</div>
        <div style={styles.price}>₹{book.price}</div>
        {book.deliveryDate && <div style={styles.delivery}>Delivery by {book.deliveryDate}</div>}
      </div>
    </div>
  )
}
