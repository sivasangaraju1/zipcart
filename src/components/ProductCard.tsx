import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import type { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.base_price,
      quantity: 1,
      image_url: product.image_url,
    });
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="card hover:shadow-md transition group"
    >
      <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 transition">
        {product.name}
      </h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-primary-600">
          ${product.base_price.toFixed(2)}
          <span className="text-sm text-gray-500 font-normal ml-1">
            /{product.unit}
          </span>
        </span>
        <button
          onClick={handleAddToCart}
          className="btn-primary text-sm"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
