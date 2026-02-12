'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllBrands } from '@/services/productService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        setBrands(response.data || response);
        setError(null);
      } catch (error: any) {
        // Only log unexpected errors
        if (error.response?.status !== 500) {
          console.error('Error fetching brands:', error);
        }
        // Network error (no response) vs API error (has response)
        if (error.message === 'Network Error' || !error.response) {
          setError('Unable to connect to server. Please check your connection.');
        } else if (error.response?.status === 500) {
          setError('The brands service is temporarily unavailable. Please try again later.');
        } else {
          setError('Failed to load brands');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading brands...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold mb-4">Service Unavailable</h1>
        <p className="text-xl text-muted-foreground mb-8">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Brands</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {brands.map((brand: any) => (
          <Link href={`/brands/${brand._id || brand.id}`} key={brand._id || brand.id}>
            <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
              <CardHeader className="p-0">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-center text-sm">{brand.name}</CardTitle>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
