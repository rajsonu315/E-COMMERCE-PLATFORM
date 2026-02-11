'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productApi } from '@/lib/api';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const res = await productApi.get(`/${productId}`);
      const product = res.data.data.product;
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stockQuantity: product.stock_quantity || product.stockQuantity || 0,
        categoryId: product.category_id || product.categoryId || '',
        imageUrl: product.image_url || product.imageUrl || '',
      });
    } catch (err) {
      console.error('Failed to fetch product', err);
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await productApi.put(`/${id}`, {
        ...formData,
        price: parseFloat(formData.price as string),
        stockQuantity: parseInt(formData.stockQuantity as string),
        categoryId: parseInt(formData.categoryId as string) || null,
      });
      router.push('/dashboard/products');
    } catch (err: any) {
      console.error('Failed to update product', err);
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading product...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-3xl font-medium text-gray-700 mb-6">Edit Product</h3>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stockQuantity">
              Stock Quantity
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              placeholder="0"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryId">
            Category ID
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="categoryId"
            name="categoryId"
            type="number"
            placeholder="Category ID"
            value={formData.categoryId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
            Image URL
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="imageUrl"
            name="imageUrl"
            type="text"
            placeholder="https://example.com/image.jpg"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Update Product'}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
