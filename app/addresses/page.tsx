'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import { getAddresses, addAddress, deleteAddress } from '@/services/addressService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';

export default function AddressesPage() {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    phone: '',
    city: '',
  });
  const router = useRouter();
  const { toast } = useToast();

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAddresses();
      setAddresses(response.data || response || []);
    } catch (error: any) {
      console.error('Error fetching addresses:', error);
      setError(error?.response?.status === 500 
        ? 'Server error. Please try again later.' 
        : 'Failed to load addresses.');
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAddress(formData);
      toast({
        title: "Address added successfully",
      });
      setFormData({ name: '', details: '', phone: '', city: '' });
      setShowForm(false);
      fetchAddresses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);
      toast({
        title: "Address deleted",
      });
      fetchAddresses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Addresses</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchAddresses}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Addresses</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Address'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">Address Details</Label>
                <Input
                  id="details"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Save Address</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {addresses.map((address: any) => (
          <Card key={address._id || address.id}>
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{address.name}</h3>
                  <p className="text-muted-foreground">{address.details}</p>
                  <p className="text-muted-foreground">{address.city}</p>
                  <p className="text-muted-foreground">{address.phone}</p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(address._id || address.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {addresses.length === 0 && !showForm && (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No addresses saved</p>
        </div>
      )}
    </div>
  );
}
