'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', permission: 'dashboard:view' },
  { name: 'Products', href: '/dashboard/products', permission: 'product:read' },
  { name: 'Categories', href: '/dashboard/categories', permission: 'category:read' },
  { name: 'Orders', href: '/dashboard/orders', permission: 'order:read' },
  { name: 'Users', href: '/dashboard/users', permission: 'user:read' },
  { name: 'Transactions', href: '/dashboard/transactions', permission: 'transaction:read' },
  { name: 'Roles', href: '/dashboard/roles', permission: 'role:read' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-900 border-r dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-3xl font-semibold text-center text-white">Admin</h2>
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          {navigation.map((item) => (
             (item.permission === 'dashboard:view' || hasPermission(item.permission)) && (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 mt-5 text-gray-400 transition-colors duration-200 transform rounded-md hover:bg-gray-800 hover:text-gray-200 ${
                  pathname === item.href ? 'bg-gray-800 text-gray-200' : ''
                }`}
              >
                <span className="mx-4 font-medium">{item.name}</span>
              </Link>
            )
          ))}
        </nav>
      </div>
    </div>
  );
}
