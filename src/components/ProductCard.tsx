import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <div className="product-image-container">
        <span className="product-category-tag">{product.category}</span>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </div>

      <div className="product-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600 }}>
            {product.rating}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ({product.stock} in stock)
          </span>
        </div>

        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div className="product-price">${product.price.toFixed(2)}</div>
          <button
            type="button"
            className="btn-add-cart"
            id={`btn-add-cart-${product.id}`}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={15} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
