import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, DollarSign, Package, Users, Factory, ArrowRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCustomers } from '../../context/CustomerContext';
import { useSuppliers } from '../../context/SupplierContext';
import { useOrders } from '../../context/OrderContext';
import { formatPrice } from '../../utils/priceCalculations';

export function DashboardPage() {
  const { products } = useProducts();
  const { customers } = useCustomers();
  const { suppliers } = useSuppliers();
  const { orders } = useOrders();

  const totalRevenue = orders.reduce((sum, order) => 
    order.status === 'Completed' ? sum + order.totalAmount : sum, 0
  );

  const statCards = [
    {
      name: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: DollarSign,
    },
    {
      name: 'Total Products',
      value: products.length.toString(),
      icon: Package,
      link: '/dashboard/products',
    },
    {
      name: 'Total Customers',
      value: customers.length.toString(),
      icon: Users,
      link: '/dashboard/customers',
    },
    {
      name: 'Total Suppliers',
      value: suppliers.length.toString(),
      icon: Factory,
      link: '/dashboard/suppliers',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Icon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
              {stat.link && (
                <Link
                  to={stat.link}
                  className="mt-4 inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-700"
                >
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Link
              to="/dashboard/orders"
              className="text-sm font-medium text-yellow-600 hover:text-yellow-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{order.customer.companyName}</p>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
            <select className="text-sm border-gray-300 rounded-md">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center">
            <BarChart3 className="h-32 w-32 text-gray-400" />
            <p className="text-gray-500">Sales chart will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
}