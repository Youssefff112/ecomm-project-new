'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WishlistContext } from '@/providers/WishlistProvider';
import { CartContext } from '@/providers/CartProvider';
import { AuthContext } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, loading, error, fetchWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      toast({
        title: "Removed from wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from wishlist",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId);
      // Remove from wishlist after adding to cart
      await removeFromWishlist(productId);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Wishlist</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchWishlist}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-8">Add products you love to your wishlist!</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-2xl lg:text-4xl font-bold mb-4 md:mb-8">My Wishlist ({wishlist.length} items)</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map((product: any) => (
          <Card key={product._id || product.id} className="overflow-hidden">
            <Link href={`/products/${product._id || product.id}`}>
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="object-cover w-full h-full hover:scale-105 transition duration-300"
                />
              </div>
            </Link>
            <CardHeader className="p-4">
              <CardTitle className="text-base line-clamp-2">{product.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <span className="text-2xl font-bold text-primary">{product.price} EGP</span>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button
                className="flex-1"
                onClick={() => handleAddToCart(product._id || product.id)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemove(product._id || product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
