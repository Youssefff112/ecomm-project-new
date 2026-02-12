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

      {/* Get the FreshCart App */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Get the FreshCart app
              </h2>
              <p className="text-muted-foreground mb-6">
                We will send you a link, open it on your phone to download the app.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button className="sm:w-auto whitespace-nowrap">
                  Share App Link
                </Button>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Payment Partners</p>
                  <div className="flex gap-2 items-center flex-wrap">
                    {/* American Express */}
                    <div className="h-10 px-3 bg-[#006FCF] rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm tracking-wide">AMEX</span>
                    </div>
                    
                    {/* Visa */}
                    <div className="h-10 px-4 bg-[#1A1F71] rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xl italic tracking-wide">VISA</span>
                    </div>
                    
                    {/* Mastercard */}
                    <div className="h-10 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
                      <svg className="h-7" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="14" cy="12" r="9" fill="#EB001B"/>
                        <circle cx="26" cy="12" r="9" fill="#F79E1B"/>
                      </svg>
                    </div>
                    
                    {/* PayPal */}
                    <div className="h-10 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
                      <svg className="h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.32 21.97a.546.546 0 01-.54-.46L6.45 14.1a.546.546 0 01.54-.63h3.3c2.48 0 4.29-.54 5.38-1.6 1.08-1.05 1.47-2.6 1.16-4.61-.06-.41-.16-.79-.29-1.15a4.45 4.45 0 00-1.1-1.58c-.93-.84-2.37-1.26-4.28-1.26h-5.4c-.69 0-1.31.48-1.45 1.15L2.09 19.97c-.08.39.18.77.58.77h2.12c.3 0 .56-.21.62-.5l.9-5.27h2.55c2.9 0 5.02-.63 6.31-1.88 1.29-1.24 1.75-3.07 1.39-5.44-.08-.52-.22-1-.41-1.42a5.45 5.45 0 00-1.34-1.92C13.91 3.42 12.12 3 9.75 3H3.63c-.85 0-1.61.59-1.78 1.42L.02 20.12c-.1.48.22.95.71.95h2.6c.37 0 .69-.26.76-.62l.74-4.35h3.13c3.57 0 6.18-.78 7.76-2.31 1.57-1.53 2.15-3.78 1.71-6.71-.09-.61-.26-1.18-.5-1.71-.24-.53-.56-1-.95-1.4-1.15-1.04-2.91-1.56-5.24-1.56H4.47c-1.05 0-2 .74-2.21 1.77L.03 20.48c-.12.6.28 1.19.89 1.19h3.2c.46 0 .86-.33.95-.77l.61-3.58h2.04c3.7 0 6.41-.81 8.05-2.41 1.64-1.6 2.23-3.93 1.78-6.92z" fill="#003087"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="text-center md:text-right">
                  <p className="text-sm text-muted-foreground mb-3">Get deliveries with FreshCart</p>
                  <div className="flex gap-2">
                    <a 
                      href="#" 
                      className="inline-block bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
                      aria-label="Download on App Store"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        <div className="text-left">
                          <div className="text-[9px] leading-none opacity-80">Download on the</div>
                          <div className="text-sm font-semibold leading-tight">App Store</div>
                        </div>
                      </div>
                    </a>
                    <a 
                      href="#" 
                      className="inline-block bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
                      aria-label="Get it on Google Play"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                        </svg>
                        <div className="text-left">
                          <div className="text-[9px] leading-none opacity-80">GET IT ON</div>
                          <div className="text-sm font-semibold leading-tight">Google Play</div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
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
