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
  const [newReview, setNewReview] = useState({ rating: 0, review: '' });
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editReview, setEditReview] = useState({ rating: 0, review: '' });
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
      }
    };

    fetchProduct();
  }, [resolvedParams.id, toast]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await getReviewsForProduct(resolvedParams.id);
        console.log('Reviews response:', response);
        const reviewsData = response.data || response.results || response || [];
        console.log('Reviews data:', reviewsData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [resolvedParams.id]);

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (newReview.rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Choose between 1 to 5 stars",
        variant: "destructive",
      });
      return;
    }

    if (!newReview.review.trim()) {
      toast({
        title: "Review required",
        description: "Please write your review before submitting",
        variant: "destructive",
      });
      return;
    }

    if (newReview.review.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write at least 10 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      await createReviewForProduct(product._id || product.id, newReview);
      toast({
        title: "Thank you for your review!",
        description: "Your review has been posted successfully",
      });
      setNewReview({ rating: 0, review: '' });
      // Refresh reviews
      const response = await getReviewsForProduct(resolvedParams.id);
      const reviewsData = response.data || response.results || response || [];
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Failed to add review";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    if (editReview.rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Choose between 1 to 5 stars",
        variant: "destructive",
      });
      return;
    }

    if (!editReview.review.trim()) {
      toast({
        title: "Review required",
        description: "Please write your review before updating",
        variant: "destructive",
      });
      return;
    }

    if (editReview.review.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write at least 10 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateReview(reviewId, editReview);
      toast({
        title: "Review updated",
        description: "Your review has been updated successfully",
      });
      setEditingReviewId(null);
      // Refresh reviews
      const response = await getReviewsForProduct(resolvedParams.id);
      const reviewsData = response.data || response.results || response || [];
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Failed to update review";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const confirmed = confirm('Are you sure you want to delete this review? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      await deleteReview(reviewId);
      toast({
        title: "Review deleted",
        description: "Your review has been removed successfully",
      });
      // Refresh reviews
      const response = await getReviewsForProduct(resolvedParams.id);
      const reviewsData = response.data || response.results || response || [];
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete review. Please try again.",
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
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.imageCover}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4 lg:space-y-6">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold mb-2">{product.title}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{product.category?.name}</p>
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            <span className="text-3xl lg:text-4xl font-bold text-primary">{product.price} EGP</span>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-lg lg:text-xl">⭐</span>
              <span className="text-base lg:text-lg">{product.ratingsAverage || 0}</span>
              <span className="text-sm md:text-base text-muted-foreground">({product.ratingsQuantity || 0} reviews)</span>
            </div>
          </div>

          <p className="text-sm md:text-base lg:text-lg leading-relaxed">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <Button onClick={handleAddToCart} size="lg" className="flex-1 w-full sm:w-auto">
              Add to Cart
            </Button>
            <Button
              onClick={handleWishlist}
              variant={isInWishlist(product._id || product.id) ? "default" : "outline"}
              size="lg"              className="w-full sm:w-auto"            >
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

      {/* Reviews Section */}
      <div className="mt-8 lg:mt-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 gap-3">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold">Customer Reviews</h2>
            {reviews.length > 0 && (
              <p className="text-muted-foreground mt-1">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            )}
          </div>
          {reviews.length > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-2xl">⭐</span>
                <span className="text-3xl font-bold">
                  {(reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
          )}
        </div>

        {/* Add Review Form */}
        {isAuthenticated ? (
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
                        className="text-3xl focus:outline-none hover:scale-110 transition"
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
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {newReview.review.length}/500 characters {newReview.review.length < 10 && newReview.review.length > 0 && '(minimum 10)'}
                  </p>
                </div>
                <Button type="submit" disabled={newReview.review.trim().length < 10}>
                  Submit Review
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">Please login to write a review</p>
              <Button onClick={() => router.push('/login')}>Login</Button>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        {reviewsLoading ? (
          <div className="text-center py-8">
            <div className="spinner mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">💭</div>
              <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">
                {isAuthenticated 
                  ? "Be the first to share your thoughts about this product!" 
                  : "Be the first to review this product - login to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <Card key={review._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  {editingReviewId === review._id ? (
                    <div className="space-y-4 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                      <p className="text-sm font-semibold text-blue-700">Editing Review</p>
                      <div>
                        <Label>Rating</Label>
                        <div className="flex gap-2 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditReview({ ...editReview, rating: star })}
                              className="text-3xl focus:outline-none hover:scale-110 transition"
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
                          maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground mt-1 text-right">
                          {editReview.review.length}/500 characters {editReview.review.length < 10 && editReview.review.length > 0 && '(minimum 10)'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdateReview(review._id)} disabled={editReview.review.trim().length < 10}>
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditingReviewId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                              {(review.user?.name || 'A').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        {user && (review.user?._id === user.id || review.user?._id === user._id) && (
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
                      <p className="text-muted-foreground leading-relaxed">{review.review}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
