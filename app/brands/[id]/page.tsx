'use client';

import { useContext, useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAllProducts, getBrandById } from '@/services/productService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/providers/AuthProvider';
import { CartContext } from '@/providers/CartProvider';
import { WishlistContext } from '@/providers/WishlistProvider';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Heart } from 'lucide-react';

export default function BrandProductsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist } = useContext(WishlistContext);
  const { toast } = useToast();

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Please login first",
        variant: "destructive",
      });
      return;
    }
    try {
      await addToCart(productId);
      toast({
        title: "Added to cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const handleToggleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Please login first",
        variant: "destructive",
      });
      return;
    }
    try {
      await addToWishlist(productId);
      toast({
        title: isInWishlist(productId) ? "Removed from wishlist" : "Added to wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchBrandAndProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch brand details
        const brandResponse = await getBrandById(resolvedParams.id);
        setBrand(brandResponse.data || brandResponse);
        
        // Fetch products filtered by brand
        const productsResponse = await getAllProducts({ brand: resolvedParams.id });
        setProducts(productsResponse.data || productsResponse);
        setError(null);
      } catch (error: any) {
        // Only log unexpected errors
        if (error.response?.status !== 500) {
          console.error('Error fetching brand products:', error);
        }
        // Network error (no response) vs API error (has response)
        if (error.message === 'Network Error' || !error.response) {
          setError('Unable to connect to server. Please check your connection.');
        } else if (error.response?.status === 500) {
          setError('The service is temporarily unavailable. Please try again later.');
        } else {
          setError('Failed to load brand products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrandAndProducts();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold mb-4">Error Loading Products</h1>
        <p className="text-xl text-muted-foreground mb-8">{error}</p>
        <Button onClick={() => router.push('/brands')}>
          Back to Brands
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Brand Header */}
      <div className="mb-8">
        <Link href="/brands" className="text-primary hover:underline mb-4 inline-block">
          ← Back to Brands
        </Link>
        {brand && (
          <div className="flex items-center gap-6 mt-4">
            <div className="relative w-24 h-24 bg-gray-100 rounded-lg p-4">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{brand.name}</h1>
              <p className="text-muted-foreground mt-2">
                {products.length} {products.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground mb-4">No products found for this brand</p>
          <Button onClick={() => router.push('/brands')}>
            Browse Other Brands
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Card key={product._id || product.id} className="overflow-hidden hover:shadow-lg transition">
              <Link href={`/products/${product._id || product.id}`}>
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <Image
                    src={product.imageCover}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              </Link>
              <CardHeader className="p-4">
                <CardTitle className="text-base line-clamp-2">{product.title}</CardTitle>
                <CardDescription className="line-clamp-1">{product.category?.name}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">{product.price} EGP</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm">{product.ratingsAverage || 0}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={(e) => handleAddToCart(product._id || product.id, e)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant={isInWishlist(product._id || product.id) ? "default" : "outline"}
                  size="icon"
                  onClick={(e) => handleToggleWishlist(product._id || product.id, e)}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product._id || product.id) ? 'fill-current' : ''}`} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
