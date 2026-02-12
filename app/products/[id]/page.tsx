'use client';

import { useEffect, useState, use, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { getProductById } from '@/services/productService';
import { getReviewsForProduct, createReviewForProduct, updateReview, deleteReview } from '@/services/reviewService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CartContext } from '@/providers/CartProvider';
import { WishlistContext } from '@/providers/WishlistProvider';
import { AuthContext } from '@/providers/AuthProvider';
import { useToast } from '@/components/ui/use-toast';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, review: '' });
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editReview, setEditReview] = useState({ rating: 5, review: '' });
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(resolvedParams.id);
        setProduct(response.data || response);
        setError(null);
      } catch (error: any) {
        // Only log unexpected errors
        if (error.response?.status !== 500 && error.response?.status !== 404) {
          console.error('Error fetching product:', error);
        }
        
        let errorMessage: string;
        
        // Network error (no response) vs API error (has response)
        if (error.message === 'Network Error' || !error.response) {
          errorMessage = 'Unable to connect to server. Please check your connection.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error - The product service is temporarily unavailable. Please try again later.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Product not found';
        } else {
          errorMessage = 'Failed to load product details';
        }
        
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await getReviewsForProduct(resolvedParams.id);
        setReviews(response.data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [resolvedParams.id]);
      }
    };

    fetchProduct();
  }, [resolvedParams.id, toast]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await addToCart(product._id || product.id);
      toast({
        title: "Success!",
        description: "Product added to cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!newReview.review.trim()) {
      toast({
        title: "Error",
        description: "Please enter a review",
        variant: "destructive",
      });
      return;
    }

    try {
      await createReviewForProduct(product._id || product.id, newReview);
      toast({
        title: "Success!",
        description: "Review added successfully",
      });
      setNewReview({ rating: 5, review: '' });
      // Refresh reviews
      const response = await getReviewsForProduct(resolvedParams.id);
      setReviews(response.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add review",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    if (!editReview.review.trim()) {
      toast({
        title: "Error",
        description: "Please enter a review",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateReview(reviewId, editReview);
      toast({
        title: "Success!",
        description: "Review updated successfully",
      });
      setEditingReviewId(null);
      // Refresh reviews
      const response = await getReviewsForProduct(resolvedParams.id);
      setReviews(response.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update review",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteReview(reviewId);
      toast({
        title: "Success!",
        description: "Review deleted successfully",
      });
      // Refresh reviews
      const response = await getReviewsForProduct(resolvedParams.id);
      setReviews(response.data || []);
    } catch (error: any) {

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>

        {/* Add Review Form */}
        {isAuthenticated && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="text-3xl focus:outline-none"
                      >
                        <span className={star <= newReview.rating ? "text-yellow-500" : "text-gray-300"}>
                          ⭐
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review">Your Review</Label>
                  <textarea
                    id="review"
                    value={newReview.review}
                    onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                    className="w-full mt-2 p-3 border rounded-md min-h-[100px]"
                    placeholder="Share your thoughts about this product..."
                  />
                </div>
                <Button type="submit">Submit Review</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        {reviewsLoading ? (
          <div className="text-center py-8">
            <div className="spinner"></div>
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <Card key={review._id}>
                <CardContent className="pt-6">
                  {editingReviewId === review._id ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Rating</Label>
                        <div className="flex gap-2 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditReview({ ...editReview, rating: star })}
                              className="text-3xl focus:outline-none"
                            >
                              <span className={star <= editReview.rating ? "text-yellow-500" : "text-gray-300"}>
                                ⭐
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Your Review</Label>
                        <textarea
                          value={editReview.review}
                          onChange={(e) => setEditReview({ ...editReview, review: e.target.value })}
                          className="w-full mt-2 p-3 border rounded-md min-h-[100px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdateReview(review._id)}>Save</Button>
                        <Button variant="outline" onClick={() => setEditingReviewId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                          {renderStars(review.rating)}
                        </div>
                        {user && review.user?._id === user.id && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditReview(review)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteReview(review._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-2">{review.review}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const startEditReview = (review: any) => {
    setEditingReviewId(review._id);
    setEditReview({ rating: review.rating, review: review.review });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "text-yellow-500" : "text-gray-300"}>
            ⭐
          </span>
        ))}
      </div>
    );
  };

    try {
      if (isInWishlist(product._id || product.id)) {
        await removeFromWishlist(product._id || product.id);
        toast({
          title: "Removed from wishlist",
        });
      } else {
        await addToWishlist(product._id || product.id);
        toast({
          title: "Added to wishlist",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">{error || 'Product not found'}</h1>
        <p className="text-muted-foreground mb-6">
          {error?.includes('Server error') 
            ? 'The backend API is experiencing issues. This is a temporary problem with the Route.misr servers.'
            : 'The product you\'re looking for doesn\'t exist or has been removed.'}
        </p>
        <Button onClick={() => router.push('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.imageCover}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            <p className="text-muted-foreground">{product.category?.name}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-primary">{product.price} EGP</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-xl">⭐</span>
              <span className="text-lg">{product.ratingsAverage || 0}</span>
              <span className="text-muted-foreground">({product.ratingsQuantity || 0} reviews)</span>
            </div>
          </div>

          <p className="text-lg leading-relaxed">{product.description}</p>

          <div className="flex gap-4">
            <Button onClick={handleAddToCart} size="lg" className="flex-1">
              Add to Cart
            </Button>
            <Button
              onClick={handleWishlist}
              variant={isInWishlist(product._id || product.id) ? "default" : "outline"}
              size="lg"
            >
              {isInWishlist(product._id || product.id) ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
            </Button>
          </div>

          <div className="border-t pt-6 space-y-2">
            <p><strong>Brand:</strong> {product.brand?.name}</p>
            <p><strong>Category:</strong> {product.category?.name}</p>
            <p><strong>Subcategory:</strong> {product.subcategory?.[0]?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
