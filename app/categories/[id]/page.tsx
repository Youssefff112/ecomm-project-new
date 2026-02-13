'use client';

import { useContext, useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAllProducts, getCategoryById, getSubCategoriesByCategory } from '@/services/productService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/providers/AuthProvider';
import { CartContext } from '@/providers/CartProvider';
import { WishlistContext } from '@/providers/WishlistProvider';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Heart } from 'lucide-react';

export default function CategoryProductsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState<any>(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
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
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryResponse = await getCategoryById(resolvedParams.id);
        setCategory(categoryResponse.data || categoryResponse);
        
        // Fetch subcategories for this category
        const subcategoriesResponse = await getSubCategoriesByCategory(resolvedParams.id);
        setSubcategories(subcategoriesResponse.data || subcategoriesResponse);
        
        // Fetch products filtered by category
        const productsResponse = await getAllProducts({ category: resolvedParams.id });
        setProducts(productsResponse.data || productsResponse);
        setError(null);
      } catch (error: any) {
        // Only log unexpected errors
        if (error.response?.status !== 500) {
          console.error('Error fetching category data:', error);
        }
        // Network error (no response) vs API error (has response)
        if (error.message === 'Network Error' || !error.response) {
          setError('Unable to connect to server. Please check your connection.');
        } else if (error.response?.status === 500) {
          setError('The service is temporarily unavailable. Please try again later.');
        } else {
          setError('Failed to load category data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [resolvedParams.id]);

  // Filter products by selected subcategory
  const filteredProducts = selectedSubcategory
    ? products.filter((product: any) => product.subcategory?._id === selectedSubcategory || product.subcategory === selectedSubcategory)
    : products;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading category...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold mb-4">Error Loading Category</h1>
        <p className="text-xl text-muted-foreground mb-8">{error}</p>
        <Button onClick={() => router.push('/categories')}>
          Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      {/* Category Header */}
      <div className="mb-6 md:mb-8">
        <Link href="/categories" className="text-primary hover:underline mb-4 inline-block text-sm md:text-base">
          ← Back to Categories
        </Link>
        {category && (
          <div className="flex items-center gap-4 md:gap-6 mt-4">
            <div className="relative w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold">{category.name}</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Subcategories Filter */}
      {subcategories.length > 0 && (
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Filter by Subcategory</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSubcategory === null ? "default" : "outline"}
              onClick={() => setSelectedSubcategory(null)}
              size="sm"
            >
              All
            </Button>
            {subcategories.map((subcategory: any) => (
              <Button
                key={subcategory._id || subcategory.id}
                variant={selectedSubcategory === (subcategory._id || subcategory.id) ? "default" : "outline"}
                onClick={() => setSelectedSubcategory(subcategory._id || subcategory.id)}
                size="sm"
              >
                {subcategory.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            No products found in this {selectedSubcategory ? 'subcategory' : 'category'}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product: any) => (
            <Link href={`/products/${product._id || product.id}`} key={product._id || product.id}>
              <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={product.imageCover || product.images?.[0]}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                    {product.priceAfterDiscount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        {Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)}% OFF
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-lg line-clamp-2 mb-2">{product.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mb-3">
                    {product.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 mb-2">
                    {product.priceAfterDiscount ? (
                      <>
                        <span className="text-xl font-bold text-primary">
                          {product.priceAfterDiscount} EGP
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {product.price} EGP
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-primary">{product.price} EGP</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>⭐ {product.ratingsAverage || 0}</span>
                    <span>({product.ratingsQuantity || 0})</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 gap-2">
                  <Button
                    className="flex-1"
                    onClick={(e) => handleAddToCart(product._id || product.id, e)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => handleToggleWishlist(product._id || product.id, e)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isInWishlist(product._id || product.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
