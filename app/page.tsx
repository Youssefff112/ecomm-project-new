'use client';

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { getAllProducts } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/providers/AuthProvider';
import { CartContext } from '@/providers/CartProvider';
import { WishlistContext } from '@/providers/WishlistProvider';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Heart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist } = useContext(WishlistContext);
  const { toast } = useToast();

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    e.stopPropagation();
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
    fetchRandomProducts();
  }, []);

  const fetchRandomProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts({ limit: 40 });
      const allProducts = response.data || response || [];
      
      // Shuffle and pick random 8 products
      const shuffled = allProducts.sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 8));
      setError(null);
    } catch (error: any) {
      // Only log unexpected errors (not 500s)
      if (error.response?.status !== 500) {
        console.error('Error fetching products:', error);
      }
      // Network error (no response) vs API error (has response)
      if (error.message === 'Network Error' || !error.response) {
        setError('Unable to connect to server. Please check your connection.');
      } else if (error.response?.status === 500) {
        setError('Service temporarily unavailable');
      } else {
        setError('Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh]">
      {/* Hero Banner Swiper */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        loop={true}
        className="h-[300px] md:h-[500px]"
      >
        <SwiperSlide>
          <div className="bg-gradient-to-br from-primary to-purple-600 text-white h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6">Welcome to FreshCart</h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 md:mb-8 opacity-90">Discover amazing products at unbeatable prices</p>
              <Link href="/products">
                <Button size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </SwiperSlide>
        
        <SwiperSlide>
          <div className="bg-gradient-to-br from-pink-400 to-red-500 text-white h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6">Flash Sale! Up to 50% Off</h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 md:mb-8 opacity-90">Limited time offers on selected items</p>
              <Link href="/products">
                <Button size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8">
                  Shop Deals
                </Button>
              </Link>
            </div>
          </div>
        </SwiperSlide>
        
        <SwiperSlide>
          <div className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6">New Arrivals</h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 md:mb-8 opacity-90">Check out our latest collections</p>
              <Link href="/products">
                <Button size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8">
                  Explore Now
                </Button>
              </Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Featured Products */}
      <section className="py-10 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold mb-2 md:mb-3">Featured Products</h2>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Discover our handpicked selection of amazing products</p>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-3xl mb-4">⚠️</div>
              <p className="text-xl text-muted-foreground mb-4">{error}</p>
              <p className="text-sm text-muted-foreground mb-6">The Route.misr API is experiencing issues</p>
              <Button onClick={fetchRandomProducts} variant="outline">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="container mx-auto px-4">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true, dynamicBullets: true }}
                  loop={true}
                  className="!pb-12"
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 24,
                    },
                    1280: {
                      slidesPerView: 4,
                      spaceBetween: 28,
                    },
                  }}
                >
                  {featuredProducts.map((product: any) => (
                    <SwiperSlide key={product._id || product.id} className="h-auto">
                      <div className="h-full pb-2">
                        <div className="border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 bg-white h-full flex flex-col">
                          <Link href={`/products/${product._id || product.id}`}>
                            <div className="aspect-square relative overflow-hidden bg-gray-50 cursor-pointer">
                              <img
                                src={product.imageCover}
                                alt={product.title}
                                className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          </Link>
                          <div className="p-4 flex-1 flex flex-col">
                            <Link href={`/products/${product._id || product.id}`}>
                              <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
                                {product.category?.name}
                              </p>
                              <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-2 flex-1 min-h-[2.5rem] cursor-pointer hover:text-primary transition">
                                {product.title}
                              </h3>
                            </Link>
                            <div className="flex justify-between items-center mt-auto pt-2 border-t">
                              <span className="text-lg md:text-xl font-bold text-primary">
                                {product.price} <span className="text-sm font-normal">EGP</span>
                              </span>
                              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                                <span className="text-yellow-500 text-sm">⭐</span>
                                <span className="text-sm font-semibold">{product.ratingsAverage || 0}</span>
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Button 
                                className="flex-1" 
                                size="sm"
                                onClick={(e) => handleAddToCart(product._id || product.id, e)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                              <Button 
                                variant={isInWishlist(product._id || product.id) ? "default" : "outline"}
                                size="sm"
                                onClick={(e) => handleToggleWishlist(product._id || product.id, e)}
                                className="px-3"
                              >
                                <Heart className={`h-4 w-4 ${isInWishlist(product._id || product.id) ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}
          <div className="text-center mt-16">
            <Link href="/products">
              <Button size="lg" className="px-8 py-6 text-base">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose FreshCart?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border bg-card">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Get your products delivered quickly and safely to your doorstep
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border bg-card">
              <div className="text-5xl mb-4">💯</div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground">
                All products are verified for quality and authenticity
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border bg-card">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">
                Your transactions are protected with top-level security
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Only show if not authenticated */}
      {!isAuthenticated && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of satisfied customers today
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg">Sign Up Now</Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline">Browse Products</Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
