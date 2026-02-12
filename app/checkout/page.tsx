'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import { CartContext } from '@/providers/CartProvider';
import { getAddresses } from '@/services/addressService';
import { createCashOrder, createCheckoutSession } from '@/services/orderService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function CheckoutPage() {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { cart, fetchCart } = useContext(CartContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      setError(null);
      const response = await getAddresses();
      console.log('Addresses response:', response);
      const addressData = response.data || response || [];
      setAddresses(addressData);
      if (addressData.length > 0) {
        setSelectedAddress(addressData[0]._id || addressData[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching addresses:', error);
      // Don't show error for empty address list (500 status)
      if (error?.response?.status !== 500) {
        setError('Failed to load addresses.');
      }
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchAddresses();
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleCheckout = async () => {
    // Check if user has any addresses saved
    if (addresses.length === 0) {
      toast({
        title: "No address found",
        description: "Please add a delivery address before placing an order",
        variant: "destructive",
      });
      router.push('/addresses');
      return;
    }

    if (!selectedAddress) {
      toast({
        title: "Please select an address",
        variant: "destructive",
      });
      return;
    }

    // Find the selected address object
    const addressObj = addresses.find((addr: any) => addr._id === selectedAddress);
    if (!addressObj) {
      toast({
        title: "Invalid address",
        variant: "destructive",
      });
      return;
    }

    // Prepare shipping address data
    const shippingAddress = {
      details: addressObj.details,
      phone: addressObj.phone,
      city: addressObj.city,
    };

    setLoading(true);

    try {
      if (paymentMethod === 'cash') {
        await createCashOrder(cart?._id, shippingAddress);
        // Refresh cart to update navbar count
        await fetchCart();
        toast({
          title: "Order placed successfully!",
        });
        router.push('/payment-success');
      } else {
        // Online payment with Stripe
        const successUrl = `${window.location.origin}/payment-success`;
        const cancelUrl = `${window.location.origin}/payment-cancel`;
        const response = await createCheckoutSession(cart?._id, shippingAddress, successUrl, cancelUrl);
        if (response.session?.url) {
          window.location.href = response.session.url;
        } else {
          toast({
            title: "Error",
            description: "Failed to create payment session",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Failed to process checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!cart || !cart.products?.length) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Checkout</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchAddresses}>Try Again</Button>
        </div>
      </div>
    );
  }

  return ( 
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-2xl lg:text-4xl font-bold mb-4 md:mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAddresses ? (
                <div className="text-center py-8">
                  <div className="spinner mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading addresses...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No addresses saved</p>
                  <Link href="/addresses">
                    <Button>Add Address</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <Link href="/addresses">
                      <Button variant="outline" size="sm">Manage Addresses</Button>
                    </Link>
                  </div>
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    <div className="space-y-3">
                      {addresses.map((address: any) => (
                        <div key={address._id || address.id} className="flex items-start space-x-3 border p-3 md:p-4 rounded hover:border-primary transition">
                          <RadioGroupItem value={address._id || address.id} id={address._id || address.id} className="mt-1" />
                          <Label htmlFor={address._id || address.id} className="flex-1 cursor-pointer">
                            <div>
                              <p className="font-semibold text-sm md:text-base">{address.name}</p>
                              <p className="text-xs md:text-sm text-muted-foreground">{address.details}</p>
                              <p className="text-xs md:text-sm text-muted-foreground">{address.city} - {address.phone}</p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 border p-3 md:p-4 rounded">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer text-sm md:text-base">
                      Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 md:p-4 rounded">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer text-sm md:text-base">
                      Online Payment (Stripe)
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.products?.map((item: any) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>{item.product.title} x {item.count}</span>
                    <span>{item.price * item.count} EGP</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{cart.totalCartPrice} EGP</span>
                </div>
              </div>
              {addresses.length === 0 && !loadingAddresses && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
                  ⚠️ Please add a delivery address before placing your order
                </div>
              )}
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={loading || loadingAddresses || !selectedAddress || addresses.length === 0}
              >
                {loading ? 'Processing...' : loadingAddresses ? 'Loading...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
