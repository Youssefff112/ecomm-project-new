'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts, getAllCategories, getAllBrands } from '@/services/productService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthContext } from '@/providers/AuthProvider';
import { CartContext } from '@/providers/CartProvider';
import { WishlistContext } from '@/providers/WishlistProvider';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Heart, Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]); // Store all fetched products
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist } = useContext(WishlistContext);
  const { toast } = useToast();

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Please login first",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }
    try {
      await addToCart(productId);
      toast({
        title: "Added to cart",
        description: "Product successfully added to your cart",
      });
    } catch (error: any) {
      console.error('Add to cart error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart. Please try again.",
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
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          getAllCategories(),
          getAllBrands()
        ]);
        setCategories(categoriesRes.data || categoriesRes || []);
        setBrands(brandsRes.data || brandsRes || []);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, sortBy]);

  // Reset to page 1 when search or price filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, minPrice, maxPrice]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setCurrentPage(1); // Reset to page 1 when filters change
      
      const params: any = {
        limit: 200, // Fetch more products to enable search across all items
      };
      
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;
      if (sortBy) params.sort = sortBy;
      
      const response = await getAllProducts(params);
      const productsData = response.data || response.results || response || [];
      setAllProducts(Array.isArray(productsData) ? productsData : []);
      
      setError(null);
    } catch (error: any) {
      if (error.response?.status !== 500) {
        console.error('Error fetching products:', error);
      }
      if (error.message === 'Network Error' || !error.response) {
        setError('Unable to connect to server. Please check your connection.');
      } else if (error.response?.status === 500) {
        setError('The product service is temporarily unavailable. Please try again later.');
      } else {
        setError('Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    // Filter all products by search query and price
    let filtered = allProducts;
    
    if (searchQuery) {
      filtered = filtered.filter((product: any) =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (minPrice) {
      filtered = filtered.filter((product: any) => product.price >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      filtered = filtered.filter((product: any) => product.price <= parseFloat(maxPrice));
    }
    
    return filtered;
  };

  const getPaginatedProducts = () => {
    const filtered = getFilteredProducts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const filtered = getFilteredProducts();
    return Math.ceil(filtered.length / itemsPerPage) || 1;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const totalPages = getTotalPages();
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(page)}
          >
            {page}
          </Button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const displayedProducts = getPaginatedProducts();
  const filteredCount = getFilteredProducts().length;
  const totalPages = getTotalPages();

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
        <h1 className="text-3xl font-bold mb-4">Service Unavailable</h1>
        <p className="text-xl text-muted-foreground mb-8">{error}</p>
        <p className="text-muted-foreground mb-8">The Route.misr API backend is experiencing issues. This is temporary.</p>
        <Button onClick={() => window.location.reload()} size="lg">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      {/* Header with Search */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-4xl font-bold mb-4">Our Products</h1>
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products across all pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {(selectedCategory || selectedBrand || minPrice || maxPrice || sortBy) && (
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {[selectedCategory, selectedBrand, minPrice, maxPrice, sortBy].filter(Boolean).length}
              </span>
            )}
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Filter Products</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category: any) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand: any) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div className="space-y-2">
                  <Label>Min Price (EGP)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                  />
                </div>

                {/* Max Price */}
                <div className="space-y-2">
                  <Label>Max Price (EGP)</Label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Default</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="-ratingsAverage">Highest Rated</option>
                    <option value="-sold">Best Selling</option>
                    <option value="-createdAt">Newest First</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results count */}
        <p className="text-muted-foreground text-sm">
          Showing {displayedProducts.length} of {filteredCount} products
          {(searchQuery || selectedCategory || selectedBrand || minPrice || maxPrice) && ' (filtered)'}
        </p>
      </div>
      
      {/* Products Grid */}
      {displayedProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground mb-4">No products found</p>
          <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProducts.map((product: any) => (
            <Link href={`/products/${product._id || product.id}`} key={product._id || product.id}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={product.imageCover || product.image || '/placeholder.png'}
                      alt={product.title || 'Product'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.priceAfterDiscount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                        {Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)}% OFF
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-lg mb-2 line-clamp-1">{product.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mb-3">
                    {product.description}
                  </CardDescription>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      {product.priceAfterDiscount ? (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            EGP {product.price}
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            EGP {product.priceAfterDiscount}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold">EGP {product.price}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{product.ratingsAverage || 0}</span>
                      <span className="text-sm text-muted-foreground">
                        ({product.ratingsQuantity || 0})
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 gap-2">
                  <Button
                    onClick={(e) => handleAddToCart(product._id || product.id, e)}
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={(e) => handleToggleWishlist(product._id || product.id, e)}
                    variant={isInWishlist(product._id || product.id) ? "default" : "outline"}
                    size="icon"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
}
