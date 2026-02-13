'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from '@/services/productService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data || response);
        setError(null);
      } catch (error: any) {
        // Only log unexpected errors
        if (error.response?.status !== 500) {
          console.error('Error fetching categories:', error);
        }
        // Network error (no response) vs API error (has response)
        if (error.message === 'Network Error' || !error.response) {
          setError('Unable to connect to server. Please check your connection.');
        } else if (error.response?.status === 500) {
          setError('The categories service is temporarily unavailable. Please try again later.');
        } else {
          setError('Failed to load categories');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading categories...</p>
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

  const filteredCategories = categories.filter((category: any) =>
    category.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-2xl lg:text-4xl font-bold mb-4 md:mb-6">Shop by Category</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-2">
            Found {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {filteredCategories.map((category: any) => (
          <Link href={`/categories/${category._id || category.id}`} key={category._id || category.id}>
            <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
              <CardHeader className="p-0">
                <div className="aspect-square relative bg-gray-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-center text-sm">{category.name}</CardTitle>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCategories.length === 0 && !loading && !error && (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            {searchQuery ? `No categories found matching "${searchQuery}"` : 'No categories available at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
}
