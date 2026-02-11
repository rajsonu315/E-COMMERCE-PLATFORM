'use client';

import { useEffect, useState } from 'react';
import { productApi, orderApi, userApi } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 125000, // Mock revenue
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.allSettled([
          productApi.get('/'),
          orderApi.get('/'),
          userApi.get('/'),
        ]);

        const newStats = { ...stats };

        if (productsRes.status === 'fulfilled') {
          newStats.products = productsRes.value.data.data.products.length;
        }
        if (ordersRes.status === 'fulfilled') {
            // Assuming order API returns a list of orders
            // If it supports pagination, we might just get the count or a page. 
            // For now assume it returns all or we just count what we get.
          newStats.orders = ordersRes.value.data.data.orders.length;
        }
        if (usersRes.status === 'fulfilled') {
             // Assuming user API returns users
          newStats.users = usersRes.value.data.data.users.length;
        }

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard stats...</div>;
  }

  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700">Dashboard Overview</h3>

      <div className="mt-4">
        <div className="flex flex-wrap -mx-6">
          <div className="w-full px-6 sm:w-1/2 xl:w-1/4">
            <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
              <div className="p-3 bg-indigo-600 bg-opacity-75 rounded-full">
                {/* Icon for Products */}
                <svg className="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H24V24H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="mx-5">
                <h4 className="text-2xl font-semibold text-gray-700">{stats.products}</h4>
                <div className="text-gray-500">Total Products</div>
              </div>
            </div>
          </div>

          <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/4 sm:mt-0">
            <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
              <div className="p-3 bg-orange-600 bg-opacity-75 rounded-full">
                {/* Icon for Orders */}
                <svg className="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 10H24M4 14H24M4 18H24M4 6H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="mx-5">
                <h4 className="text-2xl font-semibold text-gray-700">{stats.orders}</h4>
                <div className="text-gray-500">Total Orders</div>
              </div>
            </div>
          </div>

          <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/4 xl:mt-0">
            <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
              <div className="p-3 bg-pink-600 bg-opacity-75 rounded-full">
                {/* Icon for Users */}
                <svg className="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M14 14C16.2091 14 18 12.2091 18 10C18 7.79086 16.2091 6 14 6C11.7909 6 10 7.79086 10 10C10 12.2091 11.7909 14 14 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M4 22V20C4 17.7909 5.79086 16 8 16H20C22.2091 16 24 17.7909 24 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="mx-5">
                <h4 className="text-2xl font-semibold text-gray-700">{stats.users}</h4>
                <div className="text-gray-500">Total Users</div>
              </div>
            </div>
          </div>

          <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/4 xl:mt-0">
            <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
              <div className="p-3 bg-green-600 bg-opacity-75 rounded-full">
                {/* Icon for Revenue */}
                <svg className="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1V23M12 1L8 5M12 1L16 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="mx-5">
                <h4 className="text-2xl font-semibold text-gray-700">${stats.revenue.toLocaleString()}</h4>
                <div className="text-gray-500">Revenue (Mock)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
